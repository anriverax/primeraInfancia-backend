import { CreateAttendaceExceptionData } from "@/temp/attendance/dto/attendance.type";
import { Command } from "@nestjs/cqrs";
import { AttendanceException } from "prisma/generated/client";

export class CreateAttendanceExceptionCommand extends Command<AttendanceException> {
  constructor(
    public readonly data: CreateAttendaceExceptionData,
    public readonly userId: number
  ) {
    super();
  }
}
