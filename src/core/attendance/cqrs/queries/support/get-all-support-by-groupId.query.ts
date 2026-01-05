import { GetAllSupportResult } from "@/core/attendance/dto/attendance.type";
import { Query } from "@nestjs/cqrs";

export class GetAllSupportByGroupIdQuery extends Query<GetAllSupportResult[]> {
  constructor(
    public readonly groupId: number,
    public readonly userId: number
  ) {
    super();
  }
}
