import { Command } from "@nestjs/cqrs";
import { IAttendanceInput, IAttendanceResult } from "@/core/attendance/dto/attendance.type";

export class CreateAttendanceCommand extends Command<IAttendanceResult> {
  constructor(
    public readonly data: IAttendanceInput,
    public readonly userId: number
  ) {
    super();
  }
}
