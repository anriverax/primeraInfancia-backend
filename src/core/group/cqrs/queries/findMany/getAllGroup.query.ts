import { IGetAllGroup } from "@/core/group/dto/group.type";
import { Query } from "@nestjs/cqrs";

export class GetAllGroupQuery extends Query<IGetAllGroup[]> {
  constructor() {
    super();
  }
}
