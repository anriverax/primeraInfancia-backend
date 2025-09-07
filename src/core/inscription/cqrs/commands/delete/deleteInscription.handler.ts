import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteInscriptionCommand } from "./deleteInscription.command";
import { InscriptionProjection } from "../../projections/inscription.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(DeleteInscriptionCommand)
export class DeleteInscriptionHandler implements ICommandHandler<DeleteInscriptionCommand> {
  constructor(private readonly enrollmentProjection: InscriptionProjection) {}
  async execute(command: DeleteInscriptionCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.enrollmentProjection.delete(data);

    return {
      statusCode: 200,
      message: "Inscripción eliminada con éxito."
    };
  }
}
