import { IGroupByUser } from "@/core/group/dto/group.type";
import { Query } from "@nestjs/cqrs";

export class GetGroupByUserQuery extends Query<IGroupByUser[]> {
  constructor(public readonly responsableId: number) {
    super();
  }
}
