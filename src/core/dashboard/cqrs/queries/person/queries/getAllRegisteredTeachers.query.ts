import { ITeacherStatus } from "@/core/dashboard/dto/dashboard.type";
import { Query } from "@nestjs/cqrs";

export class GetAllRegisteredTeachersQuery extends Query<Promise<ITeacherStatus>> {
  constructor() {
    super();
  }
}
