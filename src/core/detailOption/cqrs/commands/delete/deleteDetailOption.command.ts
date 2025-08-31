import { NestResponse } from "@/common/helpers/dto";
import { IDeleteDetailOption } from "@/core/detailOption/dto/detailOption.type";
import { Command } from "@nestjs/cqrs";

export class DeleteDetailOptionCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteDetailOption) {
    super();
  }
}
