import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateEvidenceCommand } from "./updateEvidence.command";
import { EvidenceProjection } from "../../projections/evidence.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(UpdateEvidenceCommand)
export class UpdateEvidenceHandler implements ICommandHandler<UpdateEvidenceCommand> {
  constructor(private readonly evidenceProjection: EvidenceProjection) {}
  async execute(command: UpdateEvidenceCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.evidenceProjection.update(data);

    return {
      statusCode: 200,
      message: "Evidencia actualizada con éxito."
    };
  }
}
