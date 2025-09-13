import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { IUpdateEvidence } from "../../../dto/evidence.type";

export class UpdateEvidenceCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateEvidence) {
    super();
  }
}
