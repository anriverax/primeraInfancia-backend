import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { ICreateZone } from "../../../dto/zone.dto";

export class CreateZoneCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: ICreateZone) {
    super();
  }
}
