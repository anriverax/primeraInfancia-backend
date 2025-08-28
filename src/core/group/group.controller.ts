import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GroupDto } from "./dto/group.dto";
import { NestResponse, NestResponseWithPagination } from "@/common/helpers/types";
import { UpdateGroupCommand } from "./cqrs/command/update/updateGroup.command";
import { DeleteGroupCommand } from "./cqrs/command/delete/deleteGroup.command";
import { IGroup, IGetByIdGroupWithFullName, IGroupedMentorsByMunicipality } from "./dto/group.type";
import { GetByIdGroupQuery } from "./cqrs/queries/group/findUnique/getByIdGroup.query";
import { PaginationDto } from "../../common/helpers/dto";
import { GetAllTrainerQuery } from "./cqrs/queries/personRole/trainer/getAllTrainer.query";
import { GetAllTeacherQuery } from "./cqrs/queries/personRole/teacher/getAllTeacher.query";
import { GetAllMentorQuery } from "./cqrs/queries/personRole/mentor/getAllMentor.query";
import { TeacherService } from "./services/teacher.service";
import { MentorService } from "./services/mentor.service";
import { AssignTeacherService } from "./services/assignTeacher.service";
import { GetAllGroupPaginationQuery } from "./cqrs/queries/group/pagination/getAllGroupPagination.query";
import { GetAllGroupQuery } from "./cqrs/queries/group/findMany/getAllGroup.query";
import { CreateGroupMentorCommand } from "./cqrs/command/groupMentor/create/createGroupMentor.command";
import { CreateGroupCommand } from "./cqrs/command/group/create/createGroup.command";
import { GroupMentor } from "@prisma/client";
@Controller()
@UseFilters(HttpExceptionFilter)
export class GroupController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly teacherService: TeacherService,
    private readonly mentorService: MentorService,
    private readonly assignTeacherService: AssignTeacherService
  ) {}

  @AuthRequired()
  @Post("create")
  async create(@Req() req: Request): Promise<string> {
    const groupsMentors: GroupMentor[] = [];
    let mentorData: IGroupedMentorsByMunicipality = {};
    let totalMentors: number = 0;
    let groupIndex = 0;
    const groupsWithTrainer = await this.queryBus.execute(new GetAllTrainerQuery());

    // create groups with leader
    for (const group of groupsWithTrainer) {
      await this.commandBus.execute(
        new CreateGroupCommand({ ...group, memberCount: 0, createdBy: parseInt(req["user"].sub) })
      );
    }

    const groups = await this.queryBus.execute(new GetAllGroupQuery());

    if (groups.length > 0) {
      for (const g of groups) {
        if (g.Department.id === 1) {
          const mentors = await this.queryBus.execute(new GetAllMentorQuery(g.Department.id));
          const mentorsOrdered = this.mentorService.order(mentors);

          const mentorsPerGroup = Math.floor(
            mentorsOrdered.length / groups.filter((g) => g.Department.id === 1).length
          );

          const startIndex = groupIndex * mentorsPerGroup;
          const endIndex = (groupIndex + 1) * mentorsPerGroup;
          const sliceMentors = mentorsOrdered.slice(startIndex, endIndex);
          // add mentors to groups
          for (const sm of sliceMentors) {
            await this.commandBus.execute(
              new CreateGroupMentorCommand({
                mentorId: sm.mentorId,
                groupId: g.id,
                createdBy: parseInt(req["user"].sub)
              })
            );
          }

          console.log(mentorsOrdered);
          totalMentors = mentorsOrdered.length;
          groupIndex++;

          mentorData = this.mentorService.group(mentorsOrdered);
          console.log(groupsMentors);
        }
      }
      if (totalMentors === 1203494) {
        for (const g of groups) {
          const teachers = await this.queryBus.execute(new GetAllTeacherQuery(g.Department.id));
          groupsWithTrainer.sort((a, b) => a.departmentId - b.departmentId);

          const totalTeachers = teachers.reduce((acc, escuela) => {
            return acc + escuela.PrincipalSchool.length;
          }, 0);

          const teacherData = this.teacherService.sort(teachers);

          console.log(groupsWithTrainer);
          console.log(teacherData);

          const distribution = this.assignTeacherService.numericalDistribution(
            totalTeachers,
            totalMentors
          );

          const result = this.assignTeacherService.distributeSchools(
            teacherData,
            mentorData,
            distribution,
            g.id
          );
          console.log(result);
        }
      }
    }

    return "OK";
  }

  @Get()
  async getAll(@Query() filterPagination: PaginationDto): Promise<NestResponseWithPagination<IGroup[]>> {
    const result = await this.queryBus.execute(new GetAllGroupPaginationQuery(filterPagination));

    return {
      statusCode: 200,
      message: "Listado de grupos registrados",
      data: result.data,
      meta: result.meta
    };
  }

  @AuthRequired()
  @Put("update/:id")
  async update(
    @Param("id") id: string,
    @Req() req: Request,
    @Body() data: GroupDto
  ): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new UpdateGroupCommand({
        id: parseInt(id),
        ...data,
        updatedBy: parseInt(req["user"].sub)
      })
    );
  }

  @AuthRequired()
  @Delete("delete/:id")
  async delete(@Param("id") id: string, @Req() req: Request): Promise<NestResponse<void>> {
    return this.commandBus.execute(
      new DeleteGroupCommand({ id: parseInt(id), deletedBy: parseInt(req["user"].sub) })
    );
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<NestResponse<IGetByIdGroupWithFullName>> {
    const result = await this.queryBus.execute(new GetByIdGroupQuery(parseInt(id)));

    /* eslint-disable @typescript-eslint/no-explicit-any */
    let leaders: any[] = [];
    let inscriptionPerson: any[] = [];
    /* eslint-enable @typescript-eslint/no-explicit-any */
    if (result?.GroupLeader && Array.isArray(result.GroupLeader)) {
      leaders = result.GroupLeader.map((leader) => ({
        id: leader.id,
        PersonRole: {
          id: leader.PersonRole.id,
          Person: {
            id: leader.PersonRole.Person.id,
            fullName:
              `${leader.PersonRole.Person.firstName ?? ""} ${leader.PersonRole.Person.lastName1 ?? ""} ${leader.PersonRole.Person.lastName2 ?? ""}`.trim()
          }
        }
      }));
    }

    if (result?.Inscription && Array.isArray(result.Inscription)) {
      inscriptionPerson = result.Inscription.map((inscription) => ({
        id: inscription.id,
        status: inscription.deletedAt ? "Inactivo" : "Activo",
        PersonRole: {
          id: inscription.PersonRole.id,
          Person: {
            id: inscription.PersonRole.Person.id,
            fullName:
              `${inscription.PersonRole.Person.firstName ?? ""} ${inscription.PersonRole.Person.lastName1 ?? ""} ${inscription.PersonRole.Person.lastName2 ?? ""}`.trim(),
            phoneNumber: inscription.PersonRole.Person.phoneNumber,
            User: inscription.PersonRole.Person.User,
            District: inscription.PersonRole.Person.District
          }
        }
      }));
    }

    return {
      statusCode: 200,
      message: "Listado de grupos por ID",
      data: { ...result, GroupLeader: leaders, Inscription: inscriptionPerson }
    };
  }
}
