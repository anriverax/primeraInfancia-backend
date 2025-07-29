import { Query } from "@nestjs/cqrs";

export class GetByRolIdQuery extends Query<string[]> {
  constructor(public readonly rolId: number) {
    super();
  }
}
