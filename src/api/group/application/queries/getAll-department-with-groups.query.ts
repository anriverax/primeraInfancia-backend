import { Query } from "@nestjs/cqrs";
import { IGroupListResponse } from "../dto/group.type";

export class GetAllDepartmentWithGroupsQuery extends Query<IGroupListResponse[]> {
  constructor() {
    super();
  }
}
