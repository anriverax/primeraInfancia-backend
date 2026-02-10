import { Query } from "@nestjs/cqrs";
import { IGetAllRolePermission } from "../../dto/menuPermission.type";

export class GetAllRolePermissionQuery extends Query<IGetAllRolePermission | null> {
  constructor(public readonly userId: number) {
    super();
  }
}
