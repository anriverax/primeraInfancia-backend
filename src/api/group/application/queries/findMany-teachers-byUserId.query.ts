import { Query } from "@nestjs/cqrs";
/* eslint-disable @typescript-eslint/no-explicit-any */
export class FindManyTeachersByUserIdQuery extends Query<any[]> {
  constructor(public readonly userId: number) {
    super();
  }
}
