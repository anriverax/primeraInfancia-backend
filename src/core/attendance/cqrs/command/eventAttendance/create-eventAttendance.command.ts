import { CreateEventAttendanceData } from "@/core/attendance/dto/attendance.type";
import { Command } from "@nestjs/cqrs";
import { EventAttendance } from "prisma/generated/client";

export class CreateEventAttendanceCommand extends Command<EventAttendance> {
  constructor(
    public readonly data: CreateEventAttendanceData,
    public readonly userId: number
  ) {
    super();
  }
}
