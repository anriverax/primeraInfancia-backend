import { Query } from "@nestjs/cqrs";

export class GetAllTeacherByNipQuery extends Query<Promise<number>> {
  constructor() {
    super();
  }
}
