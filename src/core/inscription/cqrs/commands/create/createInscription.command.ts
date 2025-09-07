import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { ICreateInscription } from "../../../dto/inscription.type";
import { Inscription } from "@prisma/client";

export class CreateInscriptionCommand extends Command<NestResponse<Inscription>> {
  constructor(public readonly data: ICreateInscription) {
    super();
  }
}
