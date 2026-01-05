import { Query } from "@nestjs/cqrs";

export class FindPersonByUserQuery extends Query<{ id: number } | null> {
  constructor(public readonly userId: number) {
    super();
  }
}
