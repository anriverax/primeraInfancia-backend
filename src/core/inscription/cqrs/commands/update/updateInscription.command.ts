import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { IUpdateInscription } from "../../../dto/inscription.type";

export class UpdateInscriptionCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateInscription) {
    super();
  }
}
