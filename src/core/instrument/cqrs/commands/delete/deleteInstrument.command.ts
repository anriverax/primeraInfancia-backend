import { NestResponse } from "@/common/helpers/dto";
import { IDeleteInstrument } from "@/core/instrument/dto/instrument.type";
import { Command } from "@nestjs/cqrs";

export class DeleteInstrumentCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteInstrument) {
    super();
  }
}
