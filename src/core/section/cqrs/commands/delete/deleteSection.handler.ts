import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteSectionCommand } from "./deleteSection.command";
import { SectionProjection } from "../../projections/section.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(DeleteSectionCommand)
export class DeleteSectionHandler implements ICommandHandler<DeleteSectionCommand> {
  constructor(private readonly sectionProjection: SectionProjection) {}
  async execute(command: DeleteSectionCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.sectionProjection.delete(data);

    return {
      statusCode: 200,
      message: "Sección eliminada con éxito."
    };
  }
}
