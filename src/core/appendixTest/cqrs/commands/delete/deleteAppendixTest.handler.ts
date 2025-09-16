import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteAppendixTestCommand } from "./deleteAppendixTest.command";
import { AppendixTestProjection } from "../../projections/appendixTest.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(DeleteAppendixTestCommand)
export class DeleteAppendixTestHandler implements ICommandHandler<DeleteAppendixTestCommand> {
  constructor(private readonly appendixTestProjection: AppendixTestProjection) {}
  async execute(command: DeleteAppendixTestCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.appendixTestProjection.delete(data);

    return {
      statusCode: 200,
      message: "Anexo eliminado con éxito."
    };
  }
}
