import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MentorService } from "./mentor.service";
import { GetAllMentorQuery } from "../cqrs/queries/personRole/mentor/getAllMentor.query";
import { IGroup, IGroupedMentorsByMunicipality, INewMentor } from "../dto/group.type";
import { CreateGroupMentorCommand } from "../cqrs/command/groupMentor/create/createGroupMentor.command";
import { Injectable } from "@nestjs/common";
// import * as fs from "fs";
@Injectable()
export class GroupMentorService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly mentorService: MentorService,
    private readonly commandBus: CommandBus
  ) {}
  async assignMentor(
    groups: IGroup[],
    userId: number,
    departmentIds: number[]
  ): Promise<{
    mentorData: IGroupedMentorsByMunicipality;
    totalMentors: number;
    groupMentorIds: { id: number; mentorId: number }[];
  }> {
    let totalMentors: number = 0;
    const mentorsOrderedByDepartment: Record<number, INewMentor[]> = {};
    let mentorData: IGroupedMentorsByMunicipality = {};

    const groupMentorIds: { id: number; mentorId: number }[] = [];

    for (const deptId of departmentIds) {
      const mentors = await this.queryBus.execute(new GetAllMentorQuery(deptId));
      mentorsOrderedByDepartment[deptId] = this.mentorService.order(mentors);
    }

    const departments = [...new Set(groups.map((g) => g.Department.id))];

    for (const deptId of departments) {
      const mentorsOrdered = mentorsOrderedByDepartment[deptId];

      const groupsByDept = groups.filter((gr) => gr.Department.id === deptId);
      let startIndex = 0;

      groupsByDept.forEach(async (g, i) => {
        // Calcular cuántos mentores van a este grupo
        const mentorsForThisGroup =
          Math.floor(mentorsOrdered.length / groupsByDept.length) +
          (i < mentorsOrdered.length % groupsByDept.length ? 1 : 0);

        const sliceMentors = mentorsOrdered.slice(startIndex, startIndex + mentorsForThisGroup);
        startIndex += mentorsForThisGroup;

        // Guardar mentores asignados al grupo
        for (const sm of sliceMentors) {
          const gm = await this.commandBus.execute(
            new CreateGroupMentorCommand({
              mentorId: sm.mentorId,
              groupId: g.id,
              createdBy: userId
            })
          );
          groupMentorIds.push({ id: gm.id, mentorId: gm.mentorId });
        }
      });

      totalMentors += mentorsOrdered.length;
      mentorData = { ...mentorData, ...this.mentorService.group(mentorsOrdered) };
    }

    return { mentorData, totalMentors, groupMentorIds };
  }
}
