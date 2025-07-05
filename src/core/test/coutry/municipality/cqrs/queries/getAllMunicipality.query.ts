import { Query } from "@nestjs/cqrs";
import { Municipality } from "@prisma/client";
import { NestResponse } from "@/common/helpers/dto";

export class GetAllMunicipalityQuery extends Query<NestResponse<Municipality[]>> {
  constructor() {
    super();
  }
}
