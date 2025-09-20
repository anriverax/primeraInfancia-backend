import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateAppendixCommand } from "./updateAppendix.command";
import { AppendixProjection } from "../../projections/appendix.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(UpdateAppendixCommand)
export class UpdateAppendixHandler implements ICommandHandler<UpdateAppendixCommand> {
  constructor(private readonly appendixProjection: AppendixProjection) {}
  async execute(command: UpdateAppendixCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.appendixProjection.update(data);

    return {
      statusCode: 200,
      message: "Instrumento actualizado con éxito."
    };
  }
}
