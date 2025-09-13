import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateSectionCommand } from "./updateSection.command";
import { SectionProjection } from "../../projections/section.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(UpdateSectionCommand)
export class UpdateSectionHandler implements ICommandHandler<UpdateSectionCommand> {
  constructor(private readonly sectionProjection: SectionProjection) {}
  async execute(command: UpdateSectionCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.sectionProjection.update(data);

    return {
      statusCode: 200,
      message: "Sección actualizada con éxito."
    };
  }
}
