import { Query } from "@nestjs/cqrs";
import { IGetByIdSchool } from "../../../dto/school.type";

export class GetByIdSchoolQuery extends Query<IGetByIdSchool> {
  constructor(public readonly id: number) {
    super();
  }
}
