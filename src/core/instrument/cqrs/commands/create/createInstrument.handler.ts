import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateInstrumentCommand } from "./createInstrument.command";
import { InstrumentProjection } from "../../projections/instrument.projection";
import { NestResponse } from "@/common/helpers/dto";
import { Instrument } from "@prisma/client";

@CommandHandler(CreateInstrumentCommand)
export class CreateInstrumentHandler implements ICommandHandler<CreateInstrumentCommand> {
  constructor(private readonly instrumentProjection: InstrumentProjection) {}
  async execute(command: CreateInstrumentCommand): Promise<NestResponse<Instrument>> {
    const { data } = command;

    const res = await this.instrumentProjection.create(data);

    return {
      statusCode: 201,
      message: "Instrumento creado con éxito.",
      data: res
    };
  }
}
