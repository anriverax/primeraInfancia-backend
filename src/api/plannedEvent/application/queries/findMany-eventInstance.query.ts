import { Query } from "@nestjs/cqrs";

export class FindManyEventInstanceQuery extends Query<{ id: number; name: string }[] | []> {
  constructor(public readonly userId: number) {
    super();
  }
}
