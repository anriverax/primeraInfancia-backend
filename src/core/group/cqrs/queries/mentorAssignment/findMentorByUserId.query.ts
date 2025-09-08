import { Query } from "@nestjs/cqrs";

export class FindMentorByUserIdQuery extends Query<any> {
  constructor(public readonly id: number) {
    super();
  }
}
