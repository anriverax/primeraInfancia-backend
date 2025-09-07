import { IGetByIdInscription } from "@/core/inscription/dto/inscription.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdInscriptionQuery extends Query<IGetByIdInscription> {
  constructor(public readonly id: number) {
    super();
  }
}
