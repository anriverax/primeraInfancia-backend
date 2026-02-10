import { Inject, Injectable, Logger } from "@nestjs/common";
import {
  IGroupHierarchy,
  IMentorsData,
  IParsedName,
  IPersonData,
  IProcessExcelStats,
  ITeachersData,
  ITechnicianData,
  ITrainerData,
  IUserData
} from "../application/dto/group.type";
import {
  RoleType,
  StoredEventAction,
  TeacherStatus,
  TypeGender,
  TypePersonEnum
} from "prisma/generated/enums";
import { PersonProjection } from "@/api/auth/application/projections/person.projection";
import { NameParserService } from "../domain/services/nameParser.service";
import { calculateDUIVerification } from "@/common/helpers/functions";
import { AuthDomainService } from "@/api/auth/domain/services/authDomain.service";
import { UserProjection } from "@/api/auth/application/projections/user.projection";
import { IGroupStaffRepository } from "../domain/ports/groupStaff.respository.port";
import { GroupStaff } from "prisma/generated/client";
import { EventBusWithStore } from "@/services/events/eventBusWithStore";
import { UpdateGroupStaffEvent } from "../application/event/update-groupStaff.event";
import { IPersonRepository } from "@/api/auth/domain/ports/persistence/person.repository.port";
import { ITypePersonRepository } from "../domain/ports/typePerson.respository.port";
import { UpdatePersonEvent } from "../application/event/update-person.event";
import { TeacherProjection } from "../application/projections/teacher.projection";
import { ITeacherRepository } from "../domain/ports/teacher.respository.port";
import { GroupStaffProjection } from "../application/projections/groupStaff.projection";
import { UpdateTeacherEvent } from "../application/event/update-teacher.event";

@Injectable()
export class GroupHierarchyService {
  private readonly logger = new Logger(GroupHierarchyService.name);
  private generatedDUIs = new Set<string>(); // ← Propiedad de clase

  constructor(
    private readonly userProjection: UserProjection,
    private readonly groupStaffProjection: GroupStaffProjection,
    private readonly personProjection: PersonProjection,
    private readonly teacherProjection: TeacherProjection,
    private readonly nameParserService: NameParserService,
    @Inject("IGroupStaffRepository") private groupStaffRepository: IGroupStaffRepository,
    @Inject("IPersonRepository") private personRepository: IPersonRepository,
    @Inject("ITypePersonRepository") private typePersonRepository: ITypePersonRepository,
    @Inject("ITeacherRepository") private teacherRepository: ITeacherRepository,
    private eventBus: EventBusWithStore,
    private readonly authDomain: AuthDomainService
  ) {}

  async processHierarchy(hierarchy: Map<string, IGroupHierarchy>, createdBy: number): Promise<void> {
    const stats: IProcessExcelStats = {
      totalRows: 0,
      groupsProcessed: 0,
      techniciansProcessed: 0,
      trainersProcessed: 0,
      mentorsProcessed: 0,
      teachersProcessed: 0,
      techniciansReplaced: 0,
      trainersReplaced: 0,
      mentorsReplaced: 0,
      peopleCreated: 0,
      techniciansInactivated: 0,
      trainersInactivated: 0,
      mentorsInactivated: 0,
      teachersInactivated: 0,
      errors: [],
      warnings: []
    };

    // Procesar grupos (crear/actualizar)
    /* eslint-disable @typescript-eslint/no-unused-vars */
    for (const [_groupKey, groupData] of hierarchy.entries()) {
      if (groupData.groupId === 1) {
        try {
          stats.groupsProcessed++;

          for (const [technicianKey, technicianData] of groupData.technicians.entries()) {
            console.log(`  Procesando técnico: ${technicianData.name} (ID: ${technicianKey})`);
            await this.technicalProcess(technicianData, groupData.groupId, createdBy, stats);
          }
        } catch (error) {
          const errorMsg = `Error procesando grupo ${groupData.groupName}: ${error.message}`;
          this.logger.error(errorMsg);
          stats.errors.push(errorMsg);
        }
      }
    }
    /* eslint-enable @typescript-eslint/no-unused-vars */
    // await this.reportAbsentMembers(hierarchy, cohortId, departmentId, stats);

    // return stats;
  }

  private async technicalProcess(
    technicianData: ITechnicianData,
    groupId: number,
    createdBy: number,
    stats: IProcessExcelStats
  ): Promise<void> {
    try {
      if (technicianData.isNew) {
        const fullName = this.nameParserService.parse(technicianData.name.toUpperCase());

        const personData = await this.createPersonData(
          technicianData,
          fullName,
          TypePersonEnum.TECNICO_APOYO,
          createdBy
        );

        const createdPerson = await this.personProjection.create(personData);
        technicianData.personId = createdPerson.id;

        const userData = await this.createUserData(
          fullName,
          createdBy,
          TypePersonEnum.TECNICO_APOYO,
          technicianData.personId
        );

        await this.userProjection.create(userData);
        this.logger.log(
          `✨ Person CREADA: ${fullName}(ID: ${technicianData.personId}, Tipo: ${TypePersonEnum.TECNICO_APOYO})`
        );
        stats.peopleCreated++;
      }

      if (!technicianData.personId) {
        stats.errors.push(`Técnico sin personId: ${technicianData.name}`);
        return;
      }

      const { staffInPosition, personInGroup } = await this.getPersonInPosition(
        null,
        groupId,
        technicianData.personId
      );

      // Case 1:  Position held + Person in another position
      if (staffInPosition && personInGroup) {
        if (staffInPosition.id !== personInGroup.id) {
          await this.casePositionHeld(personInGroup, null, staffInPosition, createdBy);
          technicianData.groupStaffId = personInGroup.id;
          stats.techniciansReplaced++;
          this.logger.log(`🔄 ${technicianData.name} movido a posición de técnico`);
        } else {
          this.logger.debug(`✓ Técnico sin cambios: ${technicianData.name}`);
          technicianData.groupStaffId = staffInPosition.id;
        }
      }
      // 🔍 CASE 2: Position filled + Person is NOT in the group
      else if (staffInPosition && !personInGroup) {
        // Replace person in this position
        if (staffInPosition.personId !== technicianData.personId) {
          // asdasdasdasdas
          await this.casePersonNotInGroup(
            staffInPosition,
            null,
            { personId: technicianData.personId, name: technicianData.name },
            createdBy,
            "Técnico"
          );
          stats.techniciansReplaced++;
        }
        technicianData.groupStaffId = staffInPosition.id;
      }
      // 🔍 CASE 3: Vacant position + Person is ALREADY in the group (in another position)
      else if (!staffInPosition && personInGroup) {
        await this.caseEmptyPosition(
          { name: technicianData.name },
          personInGroup,
          null,
          createdBy,
          "Técnico"
        );
        technicianData.groupStaffId = personInGroup.id;
        this.logger.log(`🔄 ${technicianData.name} movido a posición de técnico`);
      } else {
        // Crear nuevo GroupStaff
        const newStaff = await this.groupStaffProjection.create({
          groupId,
          personId: technicianData.personId,
          parentId: null,
          predecessorPersonId: null,
          createdBy
        });

        technicianData.groupStaffId = newStaff.id;
        this.logger.log(`✅ Técnico AGREGADO: ${technicianData.name} (GroupStaff ID: ${newStaff.id})`);
        stats.techniciansProcessed++;
      }

      // Process trainers under this technician
      /* eslint-disable  @typescript-eslint/no-unused-vars */
      for (const [_trainerKey, trainerData] of technicianData.trainers.entries()) {
        await this.processTrainer(trainerData, groupId, technicianData.groupStaffId!, createdBy, stats);
      }
      /* eslint-enable  @typescript-eslint/no-unused-vars */
    } catch (error) {
      const errorMsg = `Error procesando técnico ${technicianData.name}: ${error.message}`;
      this.logger.error(errorMsg);
      stats.errors.push(errorMsg);
    }
  }

  private async processTrainer(
    trainerData: ITrainerData,
    groupId: number,
    technistaffId: number,
    createdBy: number,
    stats: IProcessExcelStats
  ): Promise<void> {
    try {
      // 1. Create Person if it does not exist
      if (trainerData.isNew) {
        const fullName = this.nameParserService.parse(trainerData.name.toUpperCase());
        const personData = await this.createPersonData(
          trainerData,
          fullName,
          TypePersonEnum.FORMADOR,
          createdBy
        );

        const createdPerson = await this.personProjection.create(personData);
        trainerData.personId = createdPerson.id;

        const userData = await this.createUserData(
          fullName,
          createdBy,
          TypePersonEnum.FORMADOR,
          trainerData.personId
        );
        await this.userProjection.create(userData);
      }

      if (!trainerData.personId) {
        stats.errors.push(`Formador sin personId: ${trainerData.name}`);
        return;
      }

      if (trainerData.wasFoundInOtherRole) {
        await this.updateTyePerson(trainerData.personId, TypePersonEnum.FORMADOR, createdBy);
        this.logger.log(
          `🔄 Rol actualizado de ${trainerData.wasFoundInOtherRole} a FORMADOR: ${trainerData.name}`
        );
      }

      const { staffInPosition, personInGroup } = await this.getPersonInPosition(
        technistaffId,
        groupId,
        trainerData.personId
      );
      // 🔍 CASE 1: Position filled + Person in another position
      if (staffInPosition && personInGroup) {
        if (staffInPosition.id !== personInGroup.id) {
          await this.casePositionHeld(personInGroup, technistaffId, staffInPosition, createdBy);

          trainerData.groupStaffId = personInGroup.id;
          stats.trainersReplaced++;
          this.logger.log(`🔄 ${trainerData.name} movido a posición de formador`);
        } else {
          this.logger.debug(`✓ Formador sin cambios: ${trainerData.name}`);
          trainerData.groupStaffId = staffInPosition.id;
        }
      }
      // 🔍 CASE 2: Position filled + Person is NOT in the group
      else if (staffInPosition && !personInGroup) {
        // Replace person in this position
        if (staffInPosition.personId !== trainerData.personId) {
          // asdasdasdasdas
          await this.casePersonNotInGroup(
            staffInPosition,
            staffInPosition.parentId,
            { personId: trainerData.personId, name: trainerData.name },
            createdBy,
            "Formador"
          );
          stats.trainersReplaced++;
        }
        trainerData.groupStaffId = staffInPosition.id;
      }
      // 🔍 CASE 3: Vacant position + Person is ALREADY in the group (in another position)
      else if (!staffInPosition && personInGroup) {
        await this.caseEmptyPosition(
          { name: trainerData.name },
          personInGroup,
          technistaffId,
          createdBy,
          "Formador"
        );
        trainerData.groupStaffId = personInGroup.id;
        this.logger.log(`🔄 ${trainerData.name} movido a posición de formador`);
      }
      // 🔍 CASE 4: Position vacant + Person is NOT in the group
      else {
        // Crear nuevo GroupStaff
        const newStaff = await this.groupStaffProjection.create({
          groupId,
          personId: trainerData.personId,
          parentId: technistaffId,
          predecessorPersonId: null,
          createdBy
        });

        trainerData.groupStaffId = newStaff.id;
        this.logger.log(`✅ Formador AGREGADO: ${trainerData.name} (GroupStaff ID: ${newStaff.id})`);
        stats.trainersProcessed++;
      }

      // Process mentors under this trainer
      /* eslint-disable  @typescript-eslint/no-unused-vars */
      for (const [_mentorKey, mentorData] of trainerData.mentors.entries()) {
        await this.processMentor(mentorData, groupId, trainerData.groupStaffId!, createdBy, stats);
      }
      /* eslint-enable  @typescript-eslint/no-unused-vars */
    } catch (error) {
      const errorMsg = `Error procesando formador ${trainerData.name}: ${error.message}`;
      this.logger.error(errorMsg);
      stats.errors.push(errorMsg);
    }
  }

  private async processMentor(
    mentorData: IMentorsData,
    groupId: number,
    trainerStaffId: number,
    createdBy: number,
    stats: IProcessExcelStats
  ): Promise<void> {
    try {
      if (mentorData.isNew) {
        const fullName = this.nameParserService.parse(mentorData.name.toUpperCase());
        const personData = await this.createPersonData(
          mentorData,
          fullName,
          TypePersonEnum.MENTOR,
          createdBy
        );

        const createdPerson = await this.personProjection.create(personData);
        mentorData.personId = createdPerson.id;

        const userData = await this.createUserData(
          fullName,
          createdBy,
          TypePersonEnum.MENTOR,
          mentorData.personId
        );
        await this.userProjection.create(userData);
      }

      console.log(
        `Processing mentor: ${mentorData.name}, personId: ${mentorData.personId}, foundInOtherRole: ${mentorData.wasFoundInOtherRole}`
      );
      if (!mentorData.personId) {
        stats.errors.push(`Mentor sin personId: ${mentorData.name}`);

        return;
      }

      if (mentorData.wasFoundInOtherRole) {
        await this.updateTyePerson(mentorData.personId, TypePersonEnum.MENTOR, createdBy);
        this.logger.log(
          `🔄 Rol actualizado de ${mentorData.wasFoundInOtherRole} a MENTOR: ${mentorData.name}`
        );
      }

      const staffInPosition = await this.groupStaffRepository.findFirst<GroupStaff>({
        where: {
          groupId,
          parentId: trainerStaffId,
          deletedAt: null
        }
      });

      const personInGroup = await this.groupStaffRepository.findFirst<GroupStaff>({
        where: {
          groupId,
          personId: mentorData.personId,
          deletedAt: null
        }
      });
      // 🔍 CASE 1: Position filled + Person in another position
      if (staffInPosition && personInGroup) {
        if (staffInPosition.id !== personInGroup.id) {
          await this.casePositionHeld(personInGroup, trainerStaffId, staffInPosition, createdBy);

          mentorData.groupStaffId = personInGroup.id;
          stats.mentorsReplaced++;
          this.logger.log(`🔄 ${mentorData.name} movido a posición de mentor`);
        } else {
          this.logger.debug(`✓ Mentor sin cambios: ${mentorData.name}`);
          mentorData.groupStaffId = staffInPosition.id;
        }
      }
      // 🔍 CASE 2: Position filled + Person is NOT in the group
      else if (staffInPosition && !personInGroup) {
        console.log("1====================");
        console.log(personInGroup);
        console.log("====================");
        // Replace person in this position
        if (staffInPosition.personId !== mentorData.personId) {
          // asdasdasdasdas
          await this.casePersonNotInGroup(
            staffInPosition,
            staffInPosition.parentId,
            { personId: mentorData.personId, name: mentorData.name },
            createdBy,
            "Mentor"
          );
          stats.mentorsReplaced++;
        }
        mentorData.groupStaffId = staffInPosition.id;
      }
      // 🔍 CASE 3: Vacant position + Person is ALREADY in the group (in another position)
      else if (!staffInPosition && personInGroup) {
        await this.caseEmptyPosition(
          { name: mentorData.name },
          personInGroup,
          trainerStaffId,
          createdBy,
          "Mentor"
        );
        mentorData.groupStaffId = personInGroup.id;
        this.logger.log(`🔄 ${mentorData.name} movido a posición de mentor`);
      }
      // 🔍 CASE 4: Position vacant + Person is NOT in the group
      else {
        console.log("2====================");
        console.log(mentorData.name);
        console.log("====================");

        // Crear nuevo GroupStaff
        const newStaff = await this.groupStaffProjection.create({
          groupId,
          personId: mentorData.personId,
          parentId: trainerStaffId,
          predecessorPersonId: null,
          createdBy
        });

        mentorData.groupStaffId = newStaff.id;
        this.logger.log(`✅ Mentor AGREGADO: ${mentorData.name} (GroupStaff ID: ${newStaff.id})`);
        stats.mentorsProcessed++;
      }
      // Process mentors under this trainer

      for (const teacherData of mentorData.teachers) {
        await this.processTeacher(teacherData, mentorData.groupStaffId!, createdBy, stats);
      }
    } catch (error) {
      const errorMsg = `Error procesando mentor ${mentorData.name}: ${error.message}`;
      this.logger.error(errorMsg);
      stats.errors.push(errorMsg);
    }
  }
  private async processTeacher(
    teacherData: ITeachersData,
    mentorStaffId: number,
    createdBy: number,
    stats: IProcessExcelStats
  ): Promise<void> {
    try {
      // 1️⃣ PASO 1: Obtener mentorGroupId para búsquedas posteriores
      const mentorGroupId = await this.groupStaffRepository.findUnique<{ groupId: number }>({
        where: { id: mentorStaffId },
        select: { groupId: true }
      });

      if (!mentorGroupId) {
        stats.errors.push(`Mentor no encontrado: GroupStaffId ${mentorStaffId}`);
        return;
      }

      // 2️⃣ PASO 2: Validar estado del docente
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const shouldBeInactive = [
        TeacherStatus.JUBILADO,
        TeacherStatus.RETIRADO,
        TeacherStatus.INACTIVO
      ].includes(teacherData.state as any);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      // 3️⃣ PASO 3: Buscar si la persona ya existe
      const existingPerson = await this.personRepository.findUnique<{ id: number }>({
        where: {
          dui: teacherData.dui
        }
      });

      // 4️⃣ PASO 4: Si la persona NO existe pero el docente es NUEVO, crearla
      if (!existingPerson) {
        if (!teacherData.isNew) {
          stats.errors.push(
            `Docente ${teacherData.fullName} (DUI: ${teacherData.dui}) no encontrado y no es nuevo`
          );
          return;
        }

        const fullName = this.nameParserService.parse(teacherData.fullName.toUpperCase());
        const personData = await this.createPersonData(
          teacherData,
          fullName,
          TypePersonEnum.DOCENTE,
          createdBy
        );

        const newPerson = await this.personProjection.create(personData as IPersonData);
        teacherData.personId = newPerson.id;

        const userData = await this.createUserData(
          fullName,
          createdBy,
          TypePersonEnum.DOCENTE,
          teacherData.personId
        );

        const newUserData = {
          ...userData,
          email: teacherData.email
        };

        await this.userProjection.create(newUserData);
        this.logger.log(
          `✨ Person CREADA: ${fullName} (ID: ${teacherData.personId}, Tipo: ${TypePersonEnum.DOCENTE})`
        );
        stats.peopleCreated++;
      } else {
        // La persona ya existe, usar su ID
        teacherData.personId = existingPerson.id;
      }

      if (!teacherData.personId) {
        stats.errors.push(`Docente sin personId: ${teacherData.fullName}`);
        return;
      }

      // 5️⃣ PASO 5: Buscar si ya existe como teacher bajo ESTE mentor específico
      const existingTeacherUnderThisMentor = await this.teacherRepository.findFirst<{
        id: number;
        status: TeacherStatus;
      }>({
        where: {
          personId: teacherData.personId,
          groupStaffId: mentorStaffId,
          deletedAt: null
        },
        select: {
          id: true,
          status: true
        }
      });

      /* eslint-disable @typescript-eslint/no-explicit-any */
      const teacherInOtherMentor = await this.teacherRepository.findFirst<any>({
        where: {
          personId: teacherData.personId,
          deletedAt: null,
          GroupStaff: {
            groupId: mentorGroupId.groupId,
            deletedAt: null
          }
        },
        select: {
          id: true,
          groupStaffId: true,
          status: true,
          GroupStaff: {
            select: {
              id: true,
              Person: {
                select: {
                  fullName: true
                }
              }
            }
          }
        }
      });

      // 7️⃣ PASO 7: Si DEBE estar inactivo
      if (shouldBeInactive) {
        // Si existe bajo este mentor → inactivar
        if (existingTeacherUnderThisMentor) {
          await this.teacherRepository.update(existingTeacherUnderThisMentor.id, {
            deletedAt: new Date(),
            deletedBy: createdBy
          });
          this.logger.log(
            `❌ Docente inactivado por estado (${teacherData.state}): ${teacherData.fullName} (Mentor ID: ${mentorStaffId})`
          );
        }
        // Si existe bajo otro mentor → inactivar también
        if (teacherInOtherMentor && teacherInOtherMentor.groupStaffId !== mentorStaffId) {
          await this.teacherRepository.update(teacherInOtherMentor.id, {
            deletedAt: new Date(),
            deletedBy: createdBy
          });
          this.logger.log(
            `❌ Docente inactivado por estado (${teacherData.state}): ${teacherData.fullName} (Otro mentor)`
          );
        }
        stats.teachersInactivated++;
        return;
      }

      // 8️⃣ PASO 8: Si NO debe estar inactivo...

      // CASO A: Ya existe bajo ESTE mentor → No hacer nada
      if (existingTeacherUnderThisMentor && !shouldBeInactive) {
        this.logger.debug(`✓ Docente sin cambios: ${teacherData.fullName} bajo mentor ${mentorStaffId}`);
        stats.teachersProcessed++;
        return;
      }

      // CASO B: Existe bajo OTRO mentor → Actualizar groupStaffId
      if (teacherInOtherMentor && teacherInOtherMentor.groupStaffId !== mentorStaffId) {
        this.logger.warn(
          `⚠️ ${teacherData.fullName} estaba bajo otro mentor (${teacherInOtherMentor.GroupStaff.Person.fullName}). Actualizando...`
        );

        await this.eventBus.publish(
          new UpdateTeacherEvent(teacherInOtherMentor.id, {
            groupStaffId: mentorStaffId,
            updatedBy: createdBy
          }),
          {
            entityType: "Teacher",
            entityId: teacherInOtherMentor.id,
            action: StoredEventAction.ACTUALIZAR,
            oldValues: {
              groupStaffId: teacherInOtherMentor.groupStaffId,
              status: teacherInOtherMentor.status
            },
            newValues: {
              groupStaffId: mentorStaffId,
              status: teacherData.state as TeacherStatus
            },
            createdBy
          }
        );

        stats.teachersProcessed++;
        this.logger.log(`🔄 ${teacherData.fullName} movido a mentor ${mentorStaffId}`);
        return;
      }

      // CASO C: NO existe como teacher → Crear uno nuevo
      const newTeacher = await this.teacherProjection.create({
        schoolId: teacherData.schoolId,
        personId: teacherData.personId,
        groupStaffId: mentorStaffId,
        status: teacherData.state as TeacherStatus,
        createdBy
      });

      this.logger.log(
        `✅ Docente AGREGADO: ${teacherData.fullName} bajo mentor ${mentorStaffId} (Teacher ID: ${newTeacher.id})`
      );
      stats.teachersProcessed++;
    } catch (error) {
      const errorMsg = `Error procesando docente ${teacherData.fullName}: ${error.message}`;
      this.logger.error(errorMsg);
      stats.errors.push(errorMsg);
    }
  }
  private generateUniqueDUI(): string {
    let dui: string;

    do {
      const eightDigits = Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, "0");

      const verificationDigit = calculateDUIVerification(eightDigits);
      dui = `${eightDigits}-${verificationDigit}`;
    } while (this.generatedDUIs.has(dui));

    this.generatedDUIs.add(dui);
    return dui;
  }

  private getRoleFromTypePerson(typePerson: TypePersonEnum): RoleType {
    const map: Record<TypePersonEnum, RoleType> = {
      [TypePersonEnum.FORMADOR]: RoleType.USER_FORMADOR,
      [TypePersonEnum.MENTOR]: RoleType.USER_MENTOR,
      [TypePersonEnum.TECNICO_APOYO]: RoleType.USER_TECNICO_APOYO,
      [TypePersonEnum.DOCENTE]: RoleType.USER_DOCENTE,
      [TypePersonEnum.DIRECTOR]: RoleType.USER_DIRECTOR,
      [TypePersonEnum.EMPLEADO]: RoleType.USER
    };

    return map[typePerson];
  }

  private async createPersonData(
    data: any,
    fullName: IParsedName,
    typePerson: TypePersonEnum,
    createdBy: number
  ): Promise<IPersonData> {
    const typePersonId = await this.typePersonRepository.findFirst<{ id: number }>({
      where: { name: typePerson }
    });

    /* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
    const newPerson = {
      ...fullName,
      address: "Registro sin direccion",
      phoneNumber: data.phoneNumber || "0000-0000",
      dui: data.dui || this.generateUniqueDUI(),
      nip: parseInt(data.nip) || null,
      typePersonId: typePersonId?.id!,
      gender: data.gender || (Math.random() > 0.5 ? TypeGender.M : TypeGender.H),
      career: "Registro sin carrera registrada",
      districtId: parseInt(data.districtId) || Math.floor(Math.random() * 262) + 1,
      cohortId: process.env.DEFAULT_COHORT_ID ? parseInt(process.env.DEFAULT_COHORT_ID) : 1,
      createdBy
    };
    /* eslint-enable @typescript-eslint/no-non-null-asserted-optional-chain */
    return newPerson;
  }

  private async createUserData(
    fullName: IParsedName,
    createdBy: number,
    typePerson: TypePersonEnum,
    personId: number
  ): Promise<IUserData> {
    const dataPrepared = await this.authDomain.prepareUserRegistrationData(
      process.env.PASSTEMP || "Qwerty1234"
    );
    const { hashedPassword } = dataPrepared;

    const newUser = {
      personId,
      email: `${fullName.firstName.toLowerCase()}.${fullName.lastName1.toLowerCase()}@example.com${Math.floor(Math.random() * 1000)}`,
      passwd: hashedPassword,
      Role: {
        connect: { name: this.getRoleFromTypePerson(typePerson) }
      },
      createdBy
    };

    return newUser;
  }

  private async updateTyePerson(
    personId: number,
    typeEnum: TypePersonEnum,
    createdBy: number
  ): Promise<void> {
    try {
      const existingPerson = await this.personRepository.findUnique<{
        typePersonId: number;
        updatedBy: number;
      }>({
        where: { id: personId },
        select: { typePersonId: true, updatedBy: true }
      });

      const typePersonId = await this.typePersonRepository.findFirst<{ id: number }>({
        where: { name: typeEnum }
      });

      if (typePersonId && existingPerson) {
        await this.eventBus.publish(
          new UpdatePersonEvent(personId, {
            typePersonId: typePersonId.id,
            updatedBy: createdBy
          }),
          {
            entityType: "Person",
            entityId: personId,
            action: StoredEventAction.ACTUALIZAR,
            oldValues: {
              typePersonId: existingPerson.typePersonId,
              updatedBy: existingPerson.updatedBy
            },
            newValues: {
              typePersonId: typePersonId.id,
              updatedBy: createdBy
            },
            createdBy
          }
        );
      }

      this.logger.debug(`TypePerson actualizado a ${typeEnum} para personId: ${personId}`);
    } catch (error) {
      this.logger.error(`Error actualizando TypePerson: ${error.message}`);
      throw error;
    }
  }

  private async getPersonInPosition(parentId: number | null, groupId: number, personId: number) {
    const staffInPosition = await this.groupStaffRepository.findFirst<GroupStaff>({
      where: {
        groupId,
        parentId,
        deletedAt: null
      },
      orderBy: { createdAt: "asc" }
    });

    const personInGroup = await this.groupStaffRepository.findFirst<GroupStaff>({
      where: {
        groupId,
        personId,
        deletedAt: null
      }
    });

    return { staffInPosition, personInGroup };
  }

  private async casePositionHeld(
    personInGroup: GroupStaff,
    parentId: number | null,
    staffInPosition: GroupStaff,
    createdBy: number
  ): Promise<void> {
    // Move the person to the new position
    await this.eventBus.publish(
      new UpdateGroupStaffEvent(personInGroup.id, {
        personId: personInGroup.personId,
        parentId,
        predecessorPersonId: staffInPosition.personId,
        updatedBy: createdBy
      }),
      {
        entityType: "GroupStaff",
        entityId: personInGroup.id,
        action: StoredEventAction.ACTUALIZAR,
        oldValues: {
          parentId: personInGroup.parentId,
          predecessorPersonId: personInGroup.predecessorPersonId,
          updatedBy: personInGroup.updatedBy
        },
        newValues: {
          parentId,
          predecessorPersonId: staffInPosition.personId,
          updatedBy: createdBy
        },
        createdBy
      }
    );
    // Remove GroupStaff from the old position (it is now duplicated)
    await this.groupStaffRepository.update(staffInPosition.id, {
      deletedAt: new Date(),
      deletedBy: createdBy
    });
  }

  private async casePersonNotInGroup(
    staffInPosition: GroupStaff,
    parentId: number | null,
    localData: { personId: number; name: string },
    createdBy: number,
    label: string
  ) {
    await this.eventBus.publish(
      new UpdateGroupStaffEvent(staffInPosition.id, {
        personId: localData.personId,
        parentId,
        predecessorPersonId: staffInPosition.personId,
        updatedBy: createdBy
      }),
      {
        entityType: "GroupStaff",
        entityId: staffInPosition.id,
        action: StoredEventAction.ACTUALIZAR,
        oldValues: {
          personId: staffInPosition.personId,
          parentId: staffInPosition.parentId,
          predecessorPersonId: staffInPosition.predecessorPersonId,
          updatedBy: staffInPosition.updatedBy
        },
        newValues: {
          personId: localData.personId,
          parentId,
          predecessorPersonId: staffInPosition.personId,
          updatedBy: createdBy
        },
        createdBy
      }
    );

    const previousPerson = await this.personRepository.findUnique<{ fullName: true }>({
      where: { id: staffInPosition.personId },
      select: { fullName: true }
    });

    this.logger.log(`🔄 ${label} REEMPLAZADO: ${previousPerson?.fullName} → ${localData.name}`);
  }

  private async caseEmptyPosition(
    localData: { name: string },
    personInGroup: GroupStaff,
    parentId: number | null,
    createdBy: number,
    label: string
  ) {
    this.logger.warn(`⚠️ ${localData.name} está en otra posición. Moviendo a ${label}...`);

    await this.eventBus.publish(
      new UpdateGroupStaffEvent(personInGroup.id, {
        personId: personInGroup.personId,
        parentId,
        updatedBy: createdBy
      }),
      {
        entityType: "GroupStaff",
        entityId: personInGroup.id,
        action: StoredEventAction.ACTUALIZAR,
        oldValues: {
          parentId: personInGroup.parentId,
          updatedBy: personInGroup.updatedBy
        },
        newValues: {
          parentId: null,
          updatedBy: createdBy
        },
        createdBy
      }
    );
  }
}
