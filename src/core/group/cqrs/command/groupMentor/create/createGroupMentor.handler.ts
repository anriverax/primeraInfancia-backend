import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateGroupMentorCommand } from "./createGroupMentor.command";
import { GroupMentor } from "@prisma/client";
import { GroupMentorProjection } from "../../../projections/groupMentor.projection";

@CommandHandler(CreateGroupMentorCommand)
export class CreateGroupMentorHandler implements ICommandHandler<CreateGroupMentorCommand> {
  constructor(private readonly groupMentorProjection: GroupMentorProjection) {}

  async execute(command: CreateGroupMentorCommand): Promise<GroupMentor> {
    const { data } = command;

    const res = await this.groupMentorProjection.create(data);
    return res;
  }
}
