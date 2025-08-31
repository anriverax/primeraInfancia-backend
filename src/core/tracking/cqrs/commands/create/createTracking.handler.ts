import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateTrackingCommand } from "./createTracking.command";
import { TrackingProjection } from "../../projections/tracking.projection";
import { NestResponse } from "@/common/helpers/dto";
import { Tracking } from "@prisma/client";

@CommandHandler(CreateTrackingCommand)
export class CreateTrackingHandler implements ICommandHandler<CreateTrackingCommand> {
  constructor(private readonly trackingProjection: TrackingProjection) {}
  async execute(command: CreateTrackingCommand): Promise<NestResponse<Tracking>> {
    const { data } = command;

    const res = await this.trackingProjection.create(data);

    return {
      statusCode: 201,
      message: "Seguimiento creado con éxito.",
      data: res
    };
  }
}
