import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { IUpdateResponseSelectionOption } from "../../../dto/responseSelectionOption.type";

export class UpdateResponseSelectionOptionCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateResponseSelectionOption) {
    super();
  }
}
