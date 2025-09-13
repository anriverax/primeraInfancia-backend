import { NestResponse } from "@/common/helpers/types";
import { IDeleteResponseSession } from "@/core/responseSession/dto/responseSession.type";
import { Command } from "@nestjs/cqrs";

export class DeleteResponseSessionCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteResponseSession) {
    super();
  }
}
