import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { IUpdateInstrument } from "../../../dto/instrument.type";

export class UpdateInstrumentCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateInstrument) {
    super();
  }
}
