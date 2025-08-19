import { NestResponse } from "@/common/helpers/types";
import { IDeleteGroup } from "@/core/group/dto/group.type";
import { Command } from "@nestjs/cqrs";

export class DeleteGroupCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteGroup) {
    super();
  }
}
