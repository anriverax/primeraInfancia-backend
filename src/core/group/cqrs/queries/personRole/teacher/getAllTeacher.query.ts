import { Query } from "@nestjs/cqrs";

/* eslint-disable @typescript-eslint/no-explicit-any*/
export class GetAllTeacherQuery extends Query<any> {
  constructor() {
    super();
  }
}
