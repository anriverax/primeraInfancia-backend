import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteDetailOptionCommand } from "./deleteDetailOption.command";
import { DetailOptionProjection } from "../../projections/detailOption.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(DeleteDetailOptionCommand)
export class DeleteDetailOptionHandler implements ICommandHandler<DeleteDetailOptionCommand> {
  constructor(private readonly detailOptionProjection: DetailOptionProjection) {}
  async execute(command: DeleteDetailOptionCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.detailOptionProjection.delete(data);

    return {
      statusCode: 200,
      message: "Detalle de la opción eliminado con éxito."
    };
  }
}
