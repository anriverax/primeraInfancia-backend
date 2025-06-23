import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateZoneCommand } from "./updateZone.command";
import { ZoneProjection } from "../../projections/zone.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(UpdateZoneCommand)
export class UpdateZoneHandler implements ICommandHandler<UpdateZoneCommand> {
  constructor(private readonly projection: ZoneProjection) {}
  async execute(command: UpdateZoneCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.projection.update(data);

    return {
      statusCode: 200,
      message: "Zona actualizada con éxito."
    };
  }
}
