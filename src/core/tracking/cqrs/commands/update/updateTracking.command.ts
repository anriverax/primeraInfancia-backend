import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { IUpdateTracking } from "../../../dto/tracking.type";

export class UpdateTrackingCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateTracking) {
    super();
  }
}
