import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateResponseSessionCommand } from "./createResponseSession.command";
import { ResponseSessionProjection } from "../../projections/responseSession.projection";
import { NestResponse } from "@/common/helpers/dto";
import { ResponseSession } from "@prisma/client";

@CommandHandler(CreateResponseSessionCommand)
export class CreateResponseSessionHandler implements ICommandHandler<CreateResponseSessionCommand> {
  constructor(private readonly responseSessionProjection: ResponseSessionProjection) {}
  async execute(command: CreateResponseSessionCommand): Promise<NestResponse<ResponseSession>> {
    const { data } = command;

    const res = await this.responseSessionProjection.create(data);

    return {
      statusCode: 201,
      message: "Aplicación de instrumento creado con éxito.",
      data: res
    };
  }
}
