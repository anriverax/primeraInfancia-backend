import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateAppendixTestCommand } from "./updateAppendixTest.command";
import { AppendixTestProjection } from "../../projections/appendixTest.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(UpdateAppendixTestCommand)
export class UpdateAppendixTestHandler implements ICommandHandler<UpdateAppendixTestCommand> {
  constructor(private readonly appendixTestProjection: AppendixTestProjection) {}
  async execute(command: UpdateAppendixTestCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.appendixTestProjection.update(data);

    return {
      statusCode: 200,
      message: "Anexo actualizado con éxito."
    };
  }
}
