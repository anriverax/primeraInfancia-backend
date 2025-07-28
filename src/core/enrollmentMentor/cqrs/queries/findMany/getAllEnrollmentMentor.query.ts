import { IPaginatedQueryParams } from "@/common/helpers/dto";
import { IEnrollmentMentorsWithPagination } from "@/core/enrollmentMentor/dto/enrollmentMentor.type";
import { Query } from "@nestjs/cqrs";

export class GetAllEnrollmentMentorQuery extends Query<IEnrollmentMentorsWithPagination> {
  constructor(public readonly data: IPaginatedQueryParams) {
    super();
  }
}
