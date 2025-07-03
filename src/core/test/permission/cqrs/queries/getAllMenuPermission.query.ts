import { Query } from "@nestjs/cqrs";
import { IRolePermission } from "../../permission.type";

export class GetAllMenuPermissionQuery extends Query<IRolePermission[]> {
  constructor() {
    super();
  }
}
