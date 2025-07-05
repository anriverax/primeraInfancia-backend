import { IGetByIdGroup } from "@/core/group/dto/group.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdGroupQuery extends Query<IGetByIdGroup> {
  constructor(public readonly id: number) {
    super();
  }
}
