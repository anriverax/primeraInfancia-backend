import { Command } from "@nestjs/cqrs";
import { IAttendance, IAttendanceResult } from "@/core/attendance/dto/attendance.type";

export class CreateAttendanceCommand extends Command<IAttendanceResult> {
  constructor(
    public readonly data: IAttendance,
    public readonly userId: number
  ) {
    super();
  }
}
