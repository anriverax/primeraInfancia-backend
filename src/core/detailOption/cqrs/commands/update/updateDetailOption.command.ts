import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { IUpdateDetailOption } from "../../../dto/detailOption.type";

export class UpdateDetailOptionCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateDetailOption) {
    super();
  }
}
