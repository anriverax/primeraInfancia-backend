import { FindLastAttendanceResult } from "@/core/attendance/dto/attendance.type";
import { Query } from "@nestjs/cqrs";

export class FindLastAttendanceQuery extends Query<FindLastAttendanceResult | null> {
  constructor(public readonly responsableId: number) {
    super();
  }
}
