import { IGetByIdPersonRole } from "@/core/personRole/dto/personRole.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdPersonRoleQuery extends Query<IGetByIdPersonRole> {
  constructor(public readonly id: number) {
    super();
  }
}
