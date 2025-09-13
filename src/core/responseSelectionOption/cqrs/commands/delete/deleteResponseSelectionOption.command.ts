import { NestResponse } from "@/common/helpers/types";
import { IDeleteResponseSelectionOption } from "@/core/responseSelectionOption/dto/responseSelectionOption.type";
import { Command } from "@nestjs/cqrs";

export class DeleteResponseSelectionOptionCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteResponseSelectionOption) {
    super();
  }
}
