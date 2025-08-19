import { NestResponse } from "@/common/helpers/types";
import { IInscription } from "@/core/assignTypePerson/dto/assignTypePerson.type";

import { Command } from "@nestjs/cqrs";

export class CreateInscriptionCommand extends Command<NestResponse<{ count: number }>> {
  constructor(public readonly data: IInscription[]) {
    super();
  }
}
