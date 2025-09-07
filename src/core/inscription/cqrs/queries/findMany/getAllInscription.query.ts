import { IPaginatedQueryParams } from "@/common/helpers/types";
import { IInscriptionsWithPagination } from "@/core/inscription/dto/inscription.type";
import { Query } from "@nestjs/cqrs";

export class GetAllInscriptionQuery extends Query<IInscriptionsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
