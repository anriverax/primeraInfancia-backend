import { IGroupCount } from "@/core/dashboard/dto/dashboard.type";
import { Query } from "@nestjs/cqrs";

export class GetAllAttendanceQuery extends Query<Promise<IGroupCount[]>> {
  constructor(public readonly status: string) {
    super();
  }
}
