import { Query } from "@nestjs/cqrs";

export class FindGroupIdByUserIdQuery extends Query<{ id: number; groupId: number } | null> {
  constructor(
    public readonly userId: number,
    public readonly isUser: boolean
  ) {
    super();
  }
}
