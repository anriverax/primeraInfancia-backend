import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateTrackingCommand } from "./updateTracking.command";
import { TrackingProjection } from "../../projections/tracking.projection";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(UpdateTrackingCommand)
export class UpdateTrackingHandler implements ICommandHandler<UpdateTrackingCommand> {
  constructor(private readonly trackingProjection: TrackingProjection) {}
  async execute(command: UpdateTrackingCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.trackingProjection.update(data);

    return {
      statusCode: 200,
      message: "Seguimiento actualizado con éxito."
    };
  }
}
