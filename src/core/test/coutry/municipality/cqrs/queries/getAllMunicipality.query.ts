import { Query } from "@nestjs/cqrs";
import { Municipality } from "prisma/generated/client";
import { NestResponse } from "@/common/helpers/types";

export class GetAllMunicipalityQuery extends Query<NestResponse<Municipality[]>> {
  constructor() {
    super();
  }
}
