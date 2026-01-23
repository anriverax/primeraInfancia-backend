import { Query } from "@nestjs/cqrs";

export class GetAllPermissionQuery extends Query<Record<string, string[]>> {
  constructor() {
    super();
  }
}
