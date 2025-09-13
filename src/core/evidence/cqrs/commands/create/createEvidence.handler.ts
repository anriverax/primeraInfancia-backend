import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateEvidenceCommand } from "./createEvidence.command";
import { EvidenceProjection } from "../../projections/evidence.projection";
import { NestResponse } from "@/common/helpers/types";
import { Evidence } from "@prisma/client";

@CommandHandler(CreateEvidenceCommand)
export class CreateEvidenceHandler implements ICommandHandler<CreateEvidenceCommand> {
  constructor(private readonly evidenceProjection: EvidenceProjection) {}
  async execute(command: CreateEvidenceCommand): Promise<NestResponse<Evidence>> {
    const { data } = command;

    const res = await this.evidenceProjection.create(data);

    return {
      statusCode: 201,
      message: "Evidencia creada con éxito.",
      data: res
    };
  }
}
