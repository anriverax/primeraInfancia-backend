import { IPaginatedQueryParams } from "@/common/helpers/types";
import { IPersonsWithPagination } from "@/core/helper/dto/helper.type";
import { Query } from "@nestjs/cqrs";

export class GetAllPersonByTypePersonQuery extends Query<IPersonsWithPagination> {
  constructor(
    public readonly typePersonId: number,
    public readonly zoneId: number,
    public readonly pagination: IPaginatedQueryParams
  ) {
    super();
  }
}
