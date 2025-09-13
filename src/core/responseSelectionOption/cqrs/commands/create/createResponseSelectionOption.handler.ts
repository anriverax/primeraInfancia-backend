import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateResponseSelectionOptionCommand } from "./createResponseSelectionOption.command";
import { ResponseSelectionOptionProjection } from "../../projections/responseSelectionOption.projection";
import { NestResponse } from "@/common/helpers/types";
import { ResponseSelectionOption } from "@prisma/client";

@CommandHandler(CreateResponseSelectionOptionCommand)
export class CreateResponseSelectionOptionHandler
  implements ICommandHandler<CreateResponseSelectionOptionCommand>
{
  constructor(private readonly responseSelectionOptionProjection: ResponseSelectionOptionProjection) {}
  async execute(
    command: CreateResponseSelectionOptionCommand
  ): Promise<NestResponse<ResponseSelectionOption>> {
    const { data } = command;

    const res = await this.responseSelectionOptionProjection.create(data);

    return {
      statusCode: 201,
      message: "Respuesta a las opciones creada con éxito.",
      data: res
    };
  }
}
