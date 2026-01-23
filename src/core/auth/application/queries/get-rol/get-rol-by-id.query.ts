import { Query } from "@nestjs/cqrs";

export class GetRolByIdQuery extends Query<string[]> {
  constructor(public readonly rolId: number) {
    super();
  }
}
