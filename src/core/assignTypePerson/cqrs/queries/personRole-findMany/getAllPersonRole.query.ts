import { IPersonRole } from "@/core/assignTypePerson/dto/assignTypePerson.type";
import { Query } from "@nestjs/cqrs";

export class GetAllPersonRoleQuery extends Query<IPersonRole[]> {
  constructor(
    public readonly typePersonId: number,
    public readonly zoneId: number,
    public readonly memberCount: number
  ) {
    super();
  }
}
