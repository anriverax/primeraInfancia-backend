import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateInscriptionCommand } from "./createInscription.command";
import { InscriptionProjection } from "../../projections/inscription.projection";
import { NestResponse } from "@/common/helpers/types";
import { Inscription } from "@prisma/client";

@CommandHandler(CreateInscriptionCommand)
export class CreateInscriptionHandler implements ICommandHandler<CreateInscriptionCommand> {
  constructor(private readonly enrollmentProjection: InscriptionProjection) {}
  async execute(command: CreateInscriptionCommand): Promise<NestResponse<Inscription>> {
    const { data } = command;

    const res = await this.enrollmentProjection.create(data);

    return {
      statusCode: 201,
      message: "Inscripción creada con éxito.",
      data: res
    };
  }
}
