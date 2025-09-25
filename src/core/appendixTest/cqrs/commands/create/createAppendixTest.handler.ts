import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateAppendixTestCommand } from "./createAppendixTest.command";
import { AppendixTestProjection } from "../../projections/appendixTest.projection";
import { NestResponse } from "@/common/helpers/types";
import { AppendixTest } from "@prisma/client";

@CommandHandler(CreateAppendixTestCommand)
export class CreateAppendixTestHandler implements ICommandHandler<CreateAppendixTestCommand> {
  constructor(private readonly appendixTestProjection: AppendixTestProjection) {}
  async execute(command: CreateAppendixTestCommand): Promise<NestResponse<AppendixTest>> {
    const { data } = command;

    const res = await this.appendixTestProjection.create(data);

    return {
      statusCode: 201,
      message: "Anexo creado con éxito.",
      data: res
    };
  }
}
