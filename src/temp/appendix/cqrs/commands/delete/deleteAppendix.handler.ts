import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteAppendixCommand } from "./deleteAppendix.command";
import { AppendixProjection } from "../../projections/appendix.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(DeleteAppendixCommand)
export class DeleteAppendixHandler implements ICommandHandler<DeleteAppendixCommand> {
  constructor(private readonly appendixProjection: AppendixProjection) {}
  async execute(command: DeleteAppendixCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.appendixProjection.delete(data);

    return {
      statusCode: 200,
      message: "Instrumento eliminado con éxito."
    };
  }
}
