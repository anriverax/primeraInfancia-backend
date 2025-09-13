import { IGetByIdEvidence } from "@/core/evidence/dto/evidence.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdEvidenceQuery extends Query<IGetByIdEvidence> {
  constructor(public readonly id: number) {
    super();
  }
}
