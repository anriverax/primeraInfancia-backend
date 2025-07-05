import { Query } from "@nestjs/cqrs";
import { IRolePermission } from "../../permission.type";

export class MenuPermissionQuery extends Query<IRolePermission[]> {
  constructor() {
    super();
  }
}
