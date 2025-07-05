import { Query } from "@nestjs/cqrs";
import { IGetAllRolePermission } from "../../dto/catalogue.type";

export class GetAllRolePermissionQuery extends Query<IGetAllRolePermission[]> {
  constructor(public readonly rolId: number) {
    super();
  }
}
