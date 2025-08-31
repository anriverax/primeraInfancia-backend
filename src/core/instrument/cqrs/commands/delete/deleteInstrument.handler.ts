import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteInstrumentCommand } from "./deleteInstrument.command";
import { InstrumentProjection } from "../../projections/instrument.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(DeleteInstrumentCommand)
export class DeleteInstrumentHandler implements ICommandHandler<DeleteInstrumentCommand> {
  constructor(private readonly instrumentProjection: InstrumentProjection) {}
  async execute(command: DeleteInstrumentCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.instrumentProjection.delete(data);

    return {
      statusCode: 200,
      message: "Instrumento eliminado con éxito."
    };
  }
}
