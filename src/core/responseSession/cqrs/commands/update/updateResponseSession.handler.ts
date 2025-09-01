import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateResponseSessionCommand } from "./updateResponseSession.command";
import { ResponseSessionProjection } from "../../projections/responseSession.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(UpdateResponseSessionCommand)
export class UpdateResponseSessionHandler implements ICommandHandler<UpdateResponseSessionCommand> {
  constructor(private readonly responseSessionProjection: ResponseSessionProjection) {}
  async execute(command: UpdateResponseSessionCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.responseSessionProjection.update(data);

    return {
      statusCode: 200,
      message: "Aplicación de instrumento actualizado con éxito."
    };
  }
}
