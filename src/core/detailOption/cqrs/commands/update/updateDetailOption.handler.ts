import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateDetailOptionCommand } from "./updateDetailOption.command";
import { DetailOptionProjection } from "../../projections/detailOption.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(UpdateDetailOptionCommand)
export class UpdateDetailOptionHandler implements ICommandHandler<UpdateDetailOptionCommand> {
  constructor(private readonly detailOptionProjection: DetailOptionProjection) {}
  async execute(command: UpdateDetailOptionCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.detailOptionProjection.update(data);

    return {
      statusCode: 200,
      message: "Detalle de la opción actualizado con éxito."
    };
  }
}
