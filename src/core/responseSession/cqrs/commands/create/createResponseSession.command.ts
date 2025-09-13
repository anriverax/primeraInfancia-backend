import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { ICreateResponseSession } from "../../../dto/responseSession.type";
import { ResponseSession } from "@prisma/client";

export class CreateResponseSessionCommand extends Command<NestResponse<ResponseSession>> {
  constructor(public readonly data: ICreateResponseSession) {
    super();
  }
}
