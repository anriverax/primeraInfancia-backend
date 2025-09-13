import { IPaginatedQueryParams } from "@/common/helpers/types";
import { IEvidencesWithPagination } from "@/core/evidence/dto/evidence.type";
import { Query } from "@nestjs/cqrs";

export class GetAllEvidenceQuery extends Query<IEvidencesWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
