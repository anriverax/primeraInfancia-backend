import { IGetSchool } from "@/core/zone/dto/school.dto";
import { Query } from "@nestjs/cqrs";

export class GetAllSchoolQuery extends Query<IGetSchool[]> {
  constructor() {
    super();
  }
}
