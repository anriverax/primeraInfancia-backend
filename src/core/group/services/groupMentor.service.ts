import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MentorService } from "./mentor.service";
import { GetAllMentorQuery } from "../cqrs/queries/personRole/mentor/getAllMentor.query";
import { IGroup, IGroupedMentorsByMunicipality, INewMentor } from "../dto/group.type";
import { CreateGroupMentorCommand } from "../cqrs/command/groupMentor/create/createGroupMentor.command";
import { Injectable } from "@nestjs/common";

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
    let groupIndex: number = 0;
    let cloneDpId = 0;
    const groupMentorIds: { id: number; mentorId: number }[] = [];

    for (const deptId of departmentIds) {
      const mentors = await this.queryBus.execute(new GetAllMentorQuery(deptId));
      mentorsOrderedByDepartment[deptId] = this.mentorService.order(mentors);
    }

    for (const g of groups) {
      const mentorsOrdered = mentorsOrderedByDepartment[g.Department.id];

      const dpId: number = g.Department.id;

      const mentorsPerGroup = Math.floor(
        mentorsOrdered.length / groups.filter((gr) => gr.Department.id === dpId).length
      );

      const startIndex = cloneDpId === dpId ? groupIndex * mentorsPerGroup : 0;
      const endIndex = cloneDpId === dpId ? (groupIndex + 1) * mentorsPerGroup : mentorsPerGroup;
      const sliceMentors = mentorsOrdered.slice(startIndex, endIndex);

      // add mentors to groups
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

      totalMentors = mentorsOrdered.length;
      groupIndex++;

      mentorData = { ...mentorData, ...this.mentorService.group(mentorsOrdered) };
      cloneDpId = g.Department.id;
    }

    return { mentorData, totalMentors, groupMentorIds };
  }
}
