import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { IUpdateTrackingType } from "../../../dto/trackingType.type";

export class UpdateTrackingTypeCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateTrackingType) {
    super();
  }
}
