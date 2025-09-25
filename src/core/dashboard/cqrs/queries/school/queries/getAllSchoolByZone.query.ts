import { IGroupCount } from "@/core/dashboard/dto/dashboard.type";
import { Query } from "@nestjs/cqrs";

export class GetAllSchoolByZoneQuery extends Query<Promise<IGroupCount[]>> {
  constructor() {
    super();
  }
}
