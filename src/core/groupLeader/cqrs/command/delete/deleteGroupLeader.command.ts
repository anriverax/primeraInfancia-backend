import { NestResponse } from "@/common/helpers/dto";
import { IDeleteGroupLeader } from "@/core/groupLeader/dto/groupLeader.type";
import { Command } from "@nestjs/cqrs";

export class DeleteGroupLeaderCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteGroupLeader) {
    super();
  }
}
