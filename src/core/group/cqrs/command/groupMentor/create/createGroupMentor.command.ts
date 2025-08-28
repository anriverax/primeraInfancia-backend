import { ICreateGroupMentor } from "@/core/group/dto/group.type";
import { Command } from "@nestjs/cqrs";
import { GroupMentor } from "@prisma/client";

export class CreateGroupMentorCommand extends Command<GroupMentor> {
  constructor(public readonly data: ICreateGroupMentor) {
    super();
  }
}
