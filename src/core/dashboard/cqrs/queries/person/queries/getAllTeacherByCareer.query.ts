import { Query } from "@nestjs/cqrs";

export class GetAllTeacherByCareerQuery extends Query<Promise<{ career: string; count: number }[]>> {
  constructor() {
    super();
  }
}
