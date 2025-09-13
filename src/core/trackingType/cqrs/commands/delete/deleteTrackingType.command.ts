import { NestResponse } from "@/common/helpers/types";
import { IDeleteTrackingType } from "@/core/trackingType/dto/trackingType.type";
import { Command } from "@nestjs/cqrs";

export class DeleteTrackingTypeCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteTrackingType) {
    super();
  }
}
