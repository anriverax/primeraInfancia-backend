import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { ICreateSection } from "../../../dto/section.type";
import { Section } from "@prisma/client";

export class CreateSectionCommand extends Command<NestResponse<Section>> {
  constructor(public readonly data: ICreateSection) {
    super();
  }
}
