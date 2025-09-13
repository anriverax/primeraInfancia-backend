import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteOptionCommand } from "./deleteOption.command";
import { OptionProjection } from "../../projections/option.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(DeleteOptionCommand)
export class DeleteOptionHandler implements ICommandHandler<DeleteOptionCommand> {
  constructor(private readonly optionProjection: OptionProjection) {}
  async execute(command: DeleteOptionCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.optionProjection.delete(data);

    return {
      statusCode: 200,
      message: "Opción eliminado con éxito."
    };
  }
}
