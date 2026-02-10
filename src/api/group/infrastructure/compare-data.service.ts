import { Injectable, Logger } from "@nestjs/common";
import { IGroupHierarchy, IPersonWithType, ITeacherDataWithPerson } from "../application/dto/group.type";
import { TypePersonEnum } from "prisma/generated/client";
import { NameNormalizerService } from "../domain/services/nameNormalizerDomain.service";

@Injectable()
export class CompareDataService {
  private readonly logger = new Logger(CompareDataService.name);
  constructor(private readonly nameNormalizerService: NameNormalizerService) {}

  compareDBData(
    hierarchy: Map<string, IGroupHierarchy>,
    allPerson: IPersonWithType[],
    allTeachers: ITeacherDataWithPerson[]
  ): void {
    /*
    for (const group of groups) {
      for (const staff of group.GroupStaff) {
        const typePerson = staff.Person.TypePerson.name;

        const personData: IPersonFromDB = {
          id: staff.Person.id,
          fullName: staff.Person.fullName,
          groupStaffId: staff.id,
          typePerson
        };

        allStaff.push(personData);

        switch (typePerson) {
          case TypePersonEnum.TECNICO_APOYO:
            technicians.push(personData);
            break;
          case TypePersonEnum.FORMADOR:
            trainers.push(personData);
            break;
          case TypePersonEnum.MENTOR:
            mentors.push(personData);
            break;
        }

        for (const teacher of staff.Teacher) {
          teachers.push({
            id: teacher.Person.id,
            fullName: teacher.Person.fullName,
            typePerson: TypePersonEnum.DOCENTE
          });
        }
      }
    }*/

    const normalizedDB = new Map<string, IPersonWithType>();

    for (const item of allPerson) {
      const normalized = this.nameNormalizerService.normalize(item.fullName);
      normalizedDB.set(normalized, item);
    }

    this.compareTechnicians(hierarchy, normalizedDB);
    this.compareTrainers(hierarchy, normalizedDB);
    this.compareMentors(hierarchy, normalizedDB);
    this.compareTeachers(hierarchy, allTeachers);
  }

  private compareTechnicians(
    hierarchy: Map<string, IGroupHierarchy>,
    allPerson: Map<string, IPersonWithType>
  ): void {
    let found = 0;
    let foundInOtherRole = 0;
    let notFound = 0;

    for (const group of hierarchy.values()) {
      for (const [technicianKey, technicianData] of group.technicians.entries()) {
        const foundPerson = allPerson.get(technicianKey);

        if (foundPerson) {
          technicianData.personId = foundPerson.id;

          if (foundPerson.TypePerson.name !== TypePersonEnum.TECNICO_APOYO) {
            technicianData.wasFoundInOtherRole = foundPerson.TypePerson.name;
            this.logger.warn(
              `⚠ Técnico encontrado como ${foundPerson.TypePerson.name}: ${technicianData.name}`
            );
            foundInOtherRole++;
          } else {
            found++;
          }
        } else {
          notFound++;
          this.logger.warn(`✗ Técnico NUEVO: ${technicianData.name}`);
          // CREAR NUEVO TECNICO A EXCEPCION DE "VACANTE T"
        }
      }
    }

    this.logger.log(
      `Técnicos - Encontrados: ${found}, En otro rol: ${foundInOtherRole}, Nuevos: ${notFound}`
    );
  }

  private compareTrainers(
    hierarchy: Map<string, IGroupHierarchy>,
    allPerson: Map<string, IPersonWithType>
  ): void {
    let found = 0;
    let foundInOtherRole = 0;
    let notFound = 0;

    for (const group of hierarchy.values()) {
      for (const technician of group.technicians.values()) {
        for (const [trainerKey, trainerData] of technician.trainers.entries()) {
          const foundPerson = allPerson.get(trainerKey);

          if (foundPerson) {
            trainerData.personId = foundPerson.id;

            if (foundPerson.TypePerson.name !== TypePersonEnum.FORMADOR) {
              trainerData.wasFoundInOtherRole = foundPerson.TypePerson.name;
              this.logger.warn(
                `⚠ Formador encontrado como ${foundPerson.TypePerson.name}: ${trainerData.name}`
              );
              foundInOtherRole++;
            } else {
              found++;
            }
          } else {
            notFound++;
            this.logger.warn(`✗ Formador NUEVO: ${trainerData.name}`);
          }
        }
      }
    }

    this.logger.log(
      `Formadores - Encontrados: ${found}, Nuevos: ${notFound}, En otro rol: ${foundInOtherRole}`
    );
  }

  private compareMentors(
    hierarchy: Map<string, IGroupHierarchy>,
    allPerson: Map<string, IPersonWithType>
  ): void {
    let found = 0;
    let foundInOtherRole = 0;
    let notFound = 0;

    for (const group of hierarchy.values()) {
      for (const technician of group.technicians.values()) {
        for (const trainer of technician.trainers.values()) {
          for (const [mentorKey, mentorData] of trainer.mentors.entries()) {
            const foundPerson = allPerson.get(mentorKey);
            if (foundPerson) {
              mentorData.personId = foundPerson.id;

              if (foundPerson.TypePerson.name !== TypePersonEnum.MENTOR) {
                mentorData.wasFoundInOtherRole = foundPerson.TypePerson.name;
                this.logger.warn(
                  `⚠ Mentor encontrado como ${foundPerson.TypePerson.name}: ${mentorData.name}`
                );
                foundInOtherRole++;
              } else {
                found++;
              }
            } else {
              notFound++;
              this.logger.warn(`✗ Mentor NUEVO: ${mentorData.name}`);
            }
          }
        }
      }
    }

    this.logger.log(
      `Mentores - Encontrados: ${found}, En otro rol: ${foundInOtherRole}, Nuevos: ${notFound}`
    );
  }

  private compareTeachers(
    hierarchy: Map<string, IGroupHierarchy>,
    allTeachers: ITeacherDataWithPerson[]
  ): void {
    let found = 0;
    let notFound = 0;

    for (const group of hierarchy.values()) {
      for (const technician of group.technicians.values()) {
        for (const trainer of technician.trainers.values()) {
          for (const mentor of trainer.mentors.values()) {
            for (const teacher of mentor.teachers) {
              if (teacher.id !== -1) {
                const foundPerson = allTeachers.find((t) => t.Person.id === teacher.id);

                if (foundPerson) {
                  found++;
                  teacher.personId = foundPerson.id;
                } else {
                  notFound++;
                  this.logger.warn(
                    `✗ Docente NUEVO (se creará) - [sin id]: ${teacher.fullName} (DUI: ${teacher.dui})`
                  );
                  teacher.onlyAssignGroup = true;
                }
              } else {
                notFound++;
                teacher.isNew = true;
                //this.logger.warn(`✗ Docente NUEVO (se creará): ${teacher.fullName} (DUI: ${teacher.dui})`);
              }
            }
          }
        }
      }
    }

    this.logger.log(`Docentes: ${found}, Nuevos: ${notFound}`);
  }
}
