import { NestResponse } from "@/common/helpers/types";
import { IUpdateGroup } from "@/core/group/dto/group.type";
import { Command } from "@nestjs/cqrs";

export class UpdateGroupCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateGroup) {
    super();
  }
}
