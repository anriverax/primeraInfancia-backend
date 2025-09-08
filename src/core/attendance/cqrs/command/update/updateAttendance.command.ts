import { IAttendanceResult } from "@/core/attendance/dto/attendance.type";
import { Command } from "@nestjs/cqrs";

export class UpdateAttendanceCommand extends Command<IAttendanceResult> {
  constructor(
    public readonly id: number,
    public readonly userId: number
  ) {
    super();
  }
}
