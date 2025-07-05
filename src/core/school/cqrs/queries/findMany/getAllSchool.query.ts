import { IGetSchool } from "@/core/school/dto/school.dto";
import { Query } from "@nestjs/cqrs";

export class GetAllSchoolQuery extends Query<IGetSchool[]> {
  constructor() {
    super();
  }
}
