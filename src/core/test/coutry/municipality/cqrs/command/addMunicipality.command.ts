import { Command } from "@nestjs/cqrs";
import { NestResponse } from "@/common/helpers/dto";
import { IMunicipality } from "../../dto/municipality.type";

export class AddMunicipalityCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IMunicipality) {
    super();
  }
}
