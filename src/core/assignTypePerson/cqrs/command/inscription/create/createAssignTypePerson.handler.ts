import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateInscriptionCommand } from "./createInscription.command";
import { NestResponse } from "@/common/helpers/types";
import { InscriptionProjection } from "../../../projections/inscription.projection";

@CommandHandler(CreateInscriptionCommand)
export class CreateInscriptionHandler implements ICommandHandler<CreateInscriptionCommand> {
  constructor(private readonly inscriptionProjection: InscriptionProjection) {}

  async execute(command: CreateInscriptionCommand): Promise<NestResponse<{ count: number }>> {
    const { data } = command;

    const res = await this.inscriptionProjection.create(data);

    return {
      statusCode: 201,
      message: "Docentes agregados con éxito.",
      data: res
    };
  }
}
