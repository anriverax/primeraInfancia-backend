import { NestResponse } from "@/common/helpers/types";
import { IDeleteInscription } from "@/core/inscription/dto/inscription.type";
import { Command } from "@nestjs/cqrs";

export class DeleteInscriptionCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteInscription) {
    super();
  }
}
