import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { ICreateTrackingType } from "../../../dto/trackingType.type";
import { TrackingType } from "@prisma/client";

export class CreateTrackingTypeCommand extends Command<NestResponse<TrackingType>> {
  constructor(public readonly data: ICreateTrackingType) {
    super();
  }
}
