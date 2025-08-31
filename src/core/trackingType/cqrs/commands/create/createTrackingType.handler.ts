import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateTrackingTypeCommand } from "./createTrackingType.command";
import { TrackingTypeProjection } from "../../projections/trackingType.projection";
import { NestResponse } from "@/common/helpers/dto";
import { TrackingType } from "@prisma/client";

@CommandHandler(CreateTrackingTypeCommand)
export class CreateTrackingTypeHandler implements ICommandHandler<CreateTrackingTypeCommand> {
  constructor(private readonly trackingTypeProjection: TrackingTypeProjection) {}
  async execute(command: CreateTrackingTypeCommand): Promise<NestResponse<TrackingType>> {
    const { data } = command;

    const res = await this.trackingTypeProjection.create(data);

    return {
      statusCode: 201,
      message: "Tipo de seguimiento creado con éxito.",
      data: res
    };
  }
}
