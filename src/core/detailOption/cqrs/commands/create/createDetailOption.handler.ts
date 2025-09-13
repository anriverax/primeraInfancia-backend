import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateDetailOptionCommand } from "./createDetailOption.command";
import { DetailOptionProjection } from "../../projections/detailOption.projection";
import { NestResponse } from "@/common/helpers/types";
import { DetailOption } from "@prisma/client";

@CommandHandler(CreateDetailOptionCommand)
export class CreateDetailOptionHandler implements ICommandHandler<CreateDetailOptionCommand> {
  constructor(private readonly detailOptionProjection: DetailOptionProjection) {}
  async execute(command: CreateDetailOptionCommand): Promise<NestResponse<DetailOption>> {
    const { data } = command;

    const res = await this.detailOptionProjection.create(data);

    return {
      statusCode: 201,
      message: "Detalle de la opción creado con éxito.",
      data: res
    };
  }
}
