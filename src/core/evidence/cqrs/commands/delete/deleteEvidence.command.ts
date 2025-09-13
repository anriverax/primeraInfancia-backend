import { NestResponse } from "@/common/helpers/types";
import { IDeleteEvidence } from "@/core/evidence/dto/evidence.type";
import { Command } from "@nestjs/cqrs";

export class DeleteEvidenceCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteEvidence) {
    super();
  }
}
