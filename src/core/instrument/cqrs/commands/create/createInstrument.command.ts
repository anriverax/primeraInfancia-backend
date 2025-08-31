import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { ICreateInstrument } from "../../../dto/instrument.type";
import { Instrument } from "@prisma/client";

export class CreateInstrumentCommand extends Command<NestResponse<Instrument>> {
  constructor(public readonly data: ICreateInstrument) {
    super();
  }
}
