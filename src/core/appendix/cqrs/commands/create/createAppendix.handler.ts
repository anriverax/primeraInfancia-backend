import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateAppendixCommand } from "./createAppendix.command";
import { AppendixProjection } from "../../projections/appendix.projection";
import { NestResponse } from "@/common/helpers/types";
import { Appendix } from "prisma/generated/client";

@CommandHandler(CreateAppendixCommand)
export class CreateAppendixHandler implements ICommandHandler<CreateAppendixCommand> {
  constructor(private readonly appendixProjection: AppendixProjection) {}
  async execute(command: CreateAppendixCommand): Promise<NestResponse<Appendix>> {
    const { data } = command;

    const res = await this.appendixProjection.create(data);

    return {
      statusCode: 201,
      message: "Instrumento creado con éxito.",
      data: res
    };
  }
}
