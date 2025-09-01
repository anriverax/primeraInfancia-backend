import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteResponseSessionCommand } from "./deleteResponseSession.command";
import { ResponseSessionProjection } from "../../projections/responseSession.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(DeleteResponseSessionCommand)
export class DeleteResponseSessionHandler implements ICommandHandler<DeleteResponseSessionCommand> {
  constructor(private readonly responseSessionProjection: ResponseSessionProjection) {}
  async execute(command: DeleteResponseSessionCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.responseSessionProjection.delete(data);

    return {
      statusCode: 200,
      message: "Aplicación de instrumento eliminado con éxito."
    };
  }
}
