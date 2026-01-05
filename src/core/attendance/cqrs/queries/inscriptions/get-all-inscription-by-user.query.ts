import { GetAllInscriptionResult } from "@/core/attendance/dto/attendance.type";
import { Query } from "@nestjs/cqrs";

export class GetAllInscriptionByUserQuery extends Query<GetAllInscriptionResult[]> {
  constructor(
    public readonly groupStaffId: number,
    public readonly groupId: number
  ) {
    super();
  }
}
