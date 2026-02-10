import { Query } from "@nestjs/cqrs";
import { IMenuPermission } from "../dto/menuPermission.type";

export class GetAllMenuPermissionQuery extends Query<IMenuPermission[] | []> {
  constructor(public readonly userId: number) {
    super();
  }
}
