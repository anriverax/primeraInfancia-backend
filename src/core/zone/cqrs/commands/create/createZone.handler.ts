import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateZoneCommand } from "./createZone.command";
import { ZoneProjection } from "../../projections/zone.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(CreateZoneCommand)
export class CreateZoneHandler implements ICommandHandler<CreateZoneCommand> {
  constructor(private readonly projection: ZoneProjection) {}
  async execute(command: CreateZoneCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.projection.create(data);

    return {
      statusCode: 201,
      message: "Zona creada con éxito."
    };
  }
}
