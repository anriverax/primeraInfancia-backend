import { IGetAllRolePermission } from "@/core/auth/dto/auth.type";
import { Query } from "@nestjs/cqrs";

export class GetAllRolePermissionQuery extends Query<IGetAllRolePermission[]> {
  constructor(public readonly rolId: number) {
    super();
  }
}
