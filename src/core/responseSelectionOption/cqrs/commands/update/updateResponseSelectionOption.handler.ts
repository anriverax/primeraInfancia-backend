import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateResponseSelectionOptionCommand } from "./updateResponseSelectionOption.command";
import { ResponseSelectionOptionProjection } from "../../projections/responseSelectionOption.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(UpdateResponseSelectionOptionCommand)
export class UpdateResponseSelectionOptionHandler
  implements ICommandHandler<UpdateResponseSelectionOptionCommand>
{
  constructor(private readonly responseSelectionOptionProjection: ResponseSelectionOptionProjection) {}
  async execute(command: UpdateResponseSelectionOptionCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.responseSelectionOptionProjection.update(data);

    return {
      statusCode: 200,
      message: "Respuesta a las opciones actualizada con éxito."
    };
  }
}
