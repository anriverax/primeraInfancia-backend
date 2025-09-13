import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteResponseSelectionOptionCommand } from "./deleteResponseSelectionOption.command";
import { ResponseSelectionOptionProjection } from "../../projections/responseSelectionOption.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(DeleteResponseSelectionOptionCommand)
export class DeleteResponseSelectionOptionHandler
  implements ICommandHandler<DeleteResponseSelectionOptionCommand>
{
  constructor(private readonly responseSelectionOptionProjection: ResponseSelectionOptionProjection) {}
  async execute(command: DeleteResponseSelectionOptionCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.responseSelectionOptionProjection.delete(data);

    return {
      statusCode: 200,
      message: "Respuesta a las opciones eliminada con éxito."
    };
  }
}
