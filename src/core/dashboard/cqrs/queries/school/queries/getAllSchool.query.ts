import { Query } from "@nestjs/cqrs";

export class GetAllSchoolQuery extends Query<Promise<number>> {
  constructor() {
    super();
  }
}
