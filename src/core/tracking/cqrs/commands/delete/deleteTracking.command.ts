import { NestResponse } from "@/common/helpers/dto";
import { IDeleteTracking } from "@/core/tracking/dto/tracking.type";
import { Command } from "@nestjs/cqrs";

export class DeleteTrackingCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteTracking) {
    super();
  }
}
