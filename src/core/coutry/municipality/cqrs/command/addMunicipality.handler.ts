import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AddMunicipalityCommand } from "./addMunicipality.command";
import { MunicipalityProjection } from "../projections/municipality.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(AddMunicipalityCommand)
export class AddMunicipalityHandler implements ICommandHandler<AddMunicipalityCommand> {
  constructor(private projection: MunicipalityProjection) {}

  async execute(command: AddMunicipalityCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.projection.add({ ...data });

    return {
      statusCode: 200,
      message: "El municipio ha sido agregado exitosamente."
    };
  }
}
