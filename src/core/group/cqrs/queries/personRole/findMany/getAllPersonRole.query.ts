import { Query } from "@nestjs/cqrs";

export class GetAllPersonRoleQuery extends Query<any> {
  constructor() {
    super();
  }
}
