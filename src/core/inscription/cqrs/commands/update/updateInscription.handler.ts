import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateInscriptionCommand } from "./updateInscription.command";
import { InscriptionProjection } from "../../projections/inscription.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(UpdateInscriptionCommand)
export class UpdateInscriptionHandler implements ICommandHandler<UpdateInscriptionCommand> {
  constructor(private readonly inscriptionProjection: InscriptionProjection) {}
  async execute(command: UpdateInscriptionCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.inscriptionProjection.update(data);

    return {
      statusCode: 200,
      message: "Inscripción actualizada con éxito."
    };
  }
}
