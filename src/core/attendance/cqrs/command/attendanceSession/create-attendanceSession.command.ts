import { CreateAttendanceSessionData } from "@/core/attendance/dto/attendance.type";
import { Command } from "@nestjs/cqrs";
import { AttendanceSession } from "prisma/generated/client";

export class CreateAttendanceSessionCommand extends Command<AttendanceSession> {
  constructor(
    public readonly data: CreateAttendanceSessionData,
    public readonly userId: number
  ) {
    super();
  }
}
