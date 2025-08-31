import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateOptionCommand } from "./createOption.command";
import { OptionProjection } from "../../projections/option.projection";
import { NestResponse } from "@/common/helpers/dto";
import { Option } from "@prisma/client";

@CommandHandler(CreateOptionCommand)
export class CreateOptionHandler implements ICommandHandler<CreateOptionCommand> {
  constructor(private readonly optionProjection: OptionProjection) {}
  async execute(command: CreateOptionCommand): Promise<NestResponse<Option>> {
    const { data } = command;

    const res = await this.optionProjection.create(data);

    return {
      statusCode: 201,
      message: "Opción creado con éxito.",
      data: res
    };
  }
}
