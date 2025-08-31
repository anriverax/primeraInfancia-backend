import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateInstrumentCommand } from "./updateInstrument.command";
import { InstrumentProjection } from "../../projections/instrument.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(UpdateInstrumentCommand)
export class UpdateInstrumentHandler implements ICommandHandler<UpdateInstrumentCommand> {
  constructor(private readonly instrumentProjection: InstrumentProjection) {}
  async execute(command: UpdateInstrumentCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.instrumentProjection.update(data);

    return {
      statusCode: 200,
      message: "Instrumento actualizado con éxito."
    };
  }
}
