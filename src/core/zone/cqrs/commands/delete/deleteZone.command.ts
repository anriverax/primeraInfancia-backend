import { NestResponse } from "@/common/helpers/dto";
import { IDeleteZone } from "@/core/zone/dto/zone.dto";
import { Command } from "@nestjs/cqrs";

export class DeleteZoneCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteZone) {
    super();
  }
}
