import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { ICreateEvidence } from "../../../dto/evidence.type";
import { Evidence } from "@prisma/client";

export class CreateEvidenceCommand extends Command<NestResponse<Evidence>> {
  constructor(public readonly data: ICreateEvidence) {
    super();
  }
}
