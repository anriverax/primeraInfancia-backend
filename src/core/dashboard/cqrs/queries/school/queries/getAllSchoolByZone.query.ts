import { Query } from "@nestjs/cqrs";

export class GetAllSchoolByZoneQuery extends Query<Promise<{ name: string; count: number }[]>> {
  constructor() {
    super();
  }
}
