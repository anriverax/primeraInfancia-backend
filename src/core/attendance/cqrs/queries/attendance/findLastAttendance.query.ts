import { Query } from "@nestjs/cqrs";
import { IFindLastAttendace } from "@/core/attendance/dto/attendance.type";

export class FindLastAttendanceQuery extends Query<IFindLastAttendace | null> {
  constructor(public readonly responsableId: number) {
    super();
  }
}
