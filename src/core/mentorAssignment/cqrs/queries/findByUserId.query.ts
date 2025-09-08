import { Query } from "@nestjs/cqrs";
/* eslint-disable @typescript-eslint/no-explicit-any */

export class FindByUserIdQuery extends Query<any> {
  constructor(public readonly id: number) {
    super();
  }
}
