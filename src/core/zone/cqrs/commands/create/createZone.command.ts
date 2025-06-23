import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { ICreateZone } from "../../../dto/zone.dto";
import { Zone } from "@prisma/client";

export class CreateZoneCommand extends Command<NestResponse<Zone>> {
  constructor(public readonly data: ICreateZone) {
    super();
  }
}
