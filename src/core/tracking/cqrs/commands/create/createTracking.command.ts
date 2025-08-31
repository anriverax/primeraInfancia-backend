import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { ICreateTracking } from "../../../dto/tracking.type";
import { Tracking } from "@prisma/client";

export class CreateTrackingCommand extends Command<NestResponse<Tracking>> {
  constructor(public readonly data: ICreateTracking) {
    super();
  }
}
