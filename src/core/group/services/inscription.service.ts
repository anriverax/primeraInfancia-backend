import { Injectable } from "@nestjs/common";
import {
  IGroup,
  IGroupedMentorsByMunicipality,
  IGroupedTeachersByMunicipality,
  IMentorsByMunicipality
} from "../dto/group.type";
import { GetAllTeacherQuery } from "../cqrs/queries/personRole/teacher/getAllTeacher.query";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AssignTeacherService } from "./assignTeacher.service";
import { TeacherService } from "./teacher.service";
import { CreateInscriptionCommand } from "../cqrs/command/inscription/create/createInscription.command";

@Injectable()
export class InscriptionService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly assignTeacherService: AssignTeacherService,
    private readonly teacherService: TeacherService,
    private readonly commandBus: CommandBus
  ) {}
  async distributeTeachers(
    groups: IGroup[],
    totalMentors: number,
    mentorData: IGroupedMentorsByMunicipality,
    departmentIds: number[]
  ): Promise<IMentorsByMunicipality[]> {
    const totalTeachersByDepartment: Record<number, number> = {};
    const teachersOrderedByDepartment: Record<number, IGroupedTeachersByMunicipality> = {};
    let result: IMentorsByMunicipality[] = [];

    for (const deptId of departmentIds) {
      const teachers = await this.queryBus.execute(new GetAllTeacherQuery(deptId));
      totalTeachersByDepartment[deptId] = teachers.reduce((acc, school) => {
        return acc + school.PrincipalSchool.length;
      }, 0);

      teachersOrderedByDepartment[deptId] = this.teacherService.sort(teachers);
    }

    for (const g of groups) {
      if (g.Department.id === 1) {
        const teacherData = teachersOrderedByDepartment[g.Department.id];

        const distribution = this.assignTeacherService.numericalDistribution(
          totalTeachersByDepartment[g.Department.id],
          totalMentors
        );

        result = this.assignTeacherService.distributeSchools(
          teacherData,
          mentorData,
          distribution,
          g.id
        );
      }
    }

    return result;
  }

  async add(data: IMentorsByMunicipality[], userId: number) {
    for (const d of data) {
      for (const t of d.teachers) {
        await this.commandBus.execute(
          new CreateInscriptionCommand({
            groupId: d.groupId,
            teacherId: t.id,
            createdBy: userId,
            MentorAssignment: { create: { mentorId: d.mentorId } }
          })
        );
      }
    }
  }
}
