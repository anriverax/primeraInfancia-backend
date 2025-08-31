import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteTrackingTypeCommand } from "./deleteTrackingType.command";
import { TrackingTypeProjection } from "../../projections/trackingType.projection";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(DeleteTrackingTypeCommand)
export class DeleteTrackingTypeHandler implements ICommandHandler<DeleteTrackingTypeCommand> {
  constructor(private readonly trackingTypeProjection: TrackingTypeProjection) {}
  async execute(command: DeleteTrackingTypeCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.trackingTypeProjection.delete(data);

    return {
      statusCode: 200,
      message: "Tipo de seguimiento eliminado con éxito."
    };
  }
}
