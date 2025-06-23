import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteZoneCommand } from "./deleteZone.command";
import { ZoneProjection } from "../../projections/zone.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(DeleteZoneCommand)
export class DeleteZoneHandler implements ICommandHandler<DeleteZoneCommand> {
  constructor(private readonly projection: ZoneProjection) {}
  async execute(command: DeleteZoneCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.projection.delete(data);

    return {
      statusCode: 200,
      message: "Zona eliminada con éxito."
    };
  }
}
