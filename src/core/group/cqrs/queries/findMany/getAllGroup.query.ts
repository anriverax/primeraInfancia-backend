import { IGetGroup } from "@/core/group/dto/group.type";
import { Query } from "@nestjs/cqrs";

export class GetAllGroupQuery extends Query<IGetGroup[]> {
  constructor() {
    super();
  }
}
