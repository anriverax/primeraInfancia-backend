import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteTrackingCommand } from "./deleteTracking.command";
import { TrackingProjection } from "../../projections/tracking.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(DeleteTrackingCommand)
export class DeleteTrackingHandler implements ICommandHandler<DeleteTrackingCommand> {
  constructor(private readonly trackingProjection: TrackingProjection) {}
  async execute(command: DeleteTrackingCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.trackingProjection.delete(data);

    return {
      statusCode: 200,
      message: "Seguimiento eliminado con éxito."
    };
  }
}
