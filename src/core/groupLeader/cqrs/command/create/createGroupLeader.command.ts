import { NestResponse } from "@/common/helpers/dto";
import { ICreateGroupLeader } from "@/core/groupLeader/dto/groupLeader.type";
import { Command } from "@nestjs/cqrs";
import { GroupLeader } from "@prisma/client";

export class CreateGroupLeaderCommand extends Command<NestResponse<GroupLeader>> {
  constructor(public readonly data: ICreateGroupLeader) {
    super();
  }
}
