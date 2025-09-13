import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { IUpdateOption } from "../../../dto/option.type";

export class UpdateOptionCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateOption) {
    super();
  }
}
