import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { ICreateInstrument } from "../../../dto/instrument.type";
import { Instrument } from "@prisma/client";

export class CreateInstrumentCommand extends Command<NestResponse<Instrument>> {
  constructor(public readonly data: ICreateInstrument) {
    super();
  }
}
