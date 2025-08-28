import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateInscriptionCommand } from "./createInscription.command";
import { NestResponse } from "@/common/helpers/types";
import { Inscription } from "@prisma/client";
import { InscriptionProjection } from "../../../projections/inscription.projection";

@CommandHandler(CreateInscriptionCommand)
export class CreateInscriptionHandler implements ICommandHandler<CreateInscriptionCommand> {
  constructor(private readonly inscripcionProjection: InscriptionProjection) {}

  async execute(command: CreateInscriptionCommand): Promise<NestResponse<Inscription>> {
    const { data } = command;

    const res = await this.inscripcionProjection.create(data);

    return {
      statusCode: 201,
      message: "Inscripción agregada con éxito.",
      data: res
    };
  }
}
