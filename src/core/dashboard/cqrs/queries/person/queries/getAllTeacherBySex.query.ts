import { IGroupCount } from "@/core/dashboard/dto/dashboard.type";
import { Query } from "@nestjs/cqrs";

export class GetAllTeacherBySexQuery extends Query<Promise<IGroupCount[]>> {
  constructor() {
    super();
  }
}
