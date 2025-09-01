import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { IUpdateResponseSession } from "../../../dto/responseSession.type";

export class UpdateResponseSessionCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateResponseSession) {
    super();
  }
}
