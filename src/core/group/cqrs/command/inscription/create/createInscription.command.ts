import { NestResponse } from "@/common/helpers/types";
import { InscriptionTeacher } from "@/core/group/dto/group.type";
import { Command } from "@nestjs/cqrs";
import { Inscription } from "@prisma/client";

export class CreateInscriptionCommand extends Command<NestResponse<Inscription>> {
  constructor(public readonly data: InscriptionTeacher) {
    super();
  }
}
