import { NestResponse } from "@/common/helpers/types";
import { IDeleteSection } from "@/core/section/dto/section.type";
import { Command } from "@nestjs/cqrs";

export class DeleteSectionCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteSection) {
    super();
  }
}
