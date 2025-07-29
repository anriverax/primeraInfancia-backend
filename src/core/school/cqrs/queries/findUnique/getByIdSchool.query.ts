import { IGetSchool } from "@/core/school/dto/school.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdSchoolQuery extends Query<IGetSchool> {
  constructor(public readonly id: number) {
    super();
  }
}
