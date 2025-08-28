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
  ): Promise<{ mentorData: IGroupedMentorsByMunicipality; totalMentors: number }> {
    let totalMentors: number = 0;
    const mentorsOrderedByDepartment: Record<number, INewMentor[]> = {};
    let mentorData: IGroupedMentorsByMunicipality = {};
    let groupIndex: number = 0;

    for (const deptId of departmentIds) {
      const mentors = await this.queryBus.execute(new GetAllMentorQuery(deptId));
      mentorsOrderedByDepartment[deptId] = this.mentorService.order(mentors);
    }

    for (const g of groups) {
      if (g.Department.id === 1) {
        const mentorsOrdered = mentorsOrderedByDepartment[g.Department.id];

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
              createdBy: userId
            })
          );
        }

        totalMentors = mentorsOrdered.length;
        groupIndex++;

        mentorData = this.mentorService.group(mentorsOrdered);
      }
    }

    return { mentorData, totalMentors };
  }
}
