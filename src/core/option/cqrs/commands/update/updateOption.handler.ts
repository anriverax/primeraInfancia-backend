import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateOptionCommand } from "./updateOption.command";
import { OptionProjection } from "../../projections/option.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(UpdateOptionCommand)
export class UpdateOptionHandler implements ICommandHandler<UpdateOptionCommand> {
  constructor(private readonly optionProjection: OptionProjection) {}
  async execute(command: UpdateOptionCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.optionProjection.update(data);

    return {
      statusCode: 200,
      message: "Opción actualizado con éxito."
    };
  }
}
