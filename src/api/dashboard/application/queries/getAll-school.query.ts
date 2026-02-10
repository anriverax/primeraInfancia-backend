import { Query } from "@nestjs/cqrs";
import { ISchoolList } from "../dto/school.type";

export class GetAllSchoolQuery extends Query<ISchoolList[]> {
  constructor() {
    super();
  }
}
