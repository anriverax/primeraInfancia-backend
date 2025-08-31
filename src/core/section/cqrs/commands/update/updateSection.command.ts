import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { IUpdateSection } from "../../../dto/section.type";

export class UpdateSectionCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateSection) {
    super();
  }
}
