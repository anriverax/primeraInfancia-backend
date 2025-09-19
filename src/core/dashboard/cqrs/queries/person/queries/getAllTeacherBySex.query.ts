import { Query } from "@nestjs/cqrs";

export class GetAllTeacherBySexQuery extends Query<Promise<{ sex: string; count: number }[]>> {
  constructor() {
    super();
  }
}
