import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateSectionCommand } from "./createSection.command";
import { SectionProjection } from "../../projections/section.projection";
import { NestResponse } from "@/common/helpers/types";
import { Section } from "@prisma/client";

@CommandHandler(CreateSectionCommand)
export class CreateSectionHandler implements ICommandHandler<CreateSectionCommand> {
  constructor(private readonly sectionProjection: SectionProjection) {}
  async execute(command: CreateSectionCommand): Promise<NestResponse<Section>> {
    const { data } = command;

    const res = await this.sectionProjection.create(data);

    return {
      statusCode: 201,
      message: "Sección creada con éxito.",
      data: res
    };
  }
}
