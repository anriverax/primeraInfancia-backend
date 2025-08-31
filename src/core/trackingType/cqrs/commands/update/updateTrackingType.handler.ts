import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateTrackingTypeCommand } from "./updateTrackingType.command";
import { TrackingTypeProjection } from "../../projections/trackingType.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(UpdateTrackingTypeCommand)
export class UpdateTrackingTypeHandler implements ICommandHandler<UpdateTrackingTypeCommand> {
  constructor(private readonly trackingTypeProjection: TrackingTypeProjection) {}
  async execute(command: UpdateTrackingTypeCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.trackingTypeProjection.update(data);

    return {
      statusCode: 200,
      message: "Tipo de seguimiento actualizado con éxito."
    };
  }
}
