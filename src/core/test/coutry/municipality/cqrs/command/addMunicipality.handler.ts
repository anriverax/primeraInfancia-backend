import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddMunicipalityCommand } from "./addMunicipality.command";
import { MunicipalityProjection } from "../projections/municipality.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(AddMunicipalityCommand)
export class AddMunicipalityHandler implements ICommandHandler<AddMunicipalityCommand> {
  constructor(private municipalityProjection: MunicipalityProjection) {}

  async execute(command: AddMunicipalityCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.municipalityProjection.add({ ...data });

    return {
      statusCode: 200,
      message: "El municipio ha sido agregado exitosamente."
    };
  }
}
