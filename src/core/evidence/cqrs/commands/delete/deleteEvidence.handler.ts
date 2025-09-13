import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteEvidenceCommand } from "./deleteEvidence.command";
import { EvidenceProjection } from "../../projections/evidence.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(DeleteEvidenceCommand)
export class DeleteEvidenceHandler implements ICommandHandler<DeleteEvidenceCommand> {
  constructor(private readonly evidenceProjection: EvidenceProjection) {}
  async execute(command: DeleteEvidenceCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.evidenceProjection.delete(data);

    return {
      statusCode: 200,
      message: "Evidencia eliminada con éxito."
    };
  }
}
