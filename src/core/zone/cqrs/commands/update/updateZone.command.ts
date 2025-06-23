import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { IUpdateZone } from "../../../dto/zone.dto";

export class UpdateZoneCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateZone) {
    super();
  }
}
