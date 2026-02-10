import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AttendanceException } from "prisma/generated/client";
import { CreateAttendanceExceptionCommand } from "./create-attendanceException.command";
import { AttendanceExceptionProjection } from "../../projections/exceptionAttendance.projection";

@CommandHandler(CreateAttendanceExceptionCommand)
export class CreateAttendanceExceptionHandler implements ICommandHandler<CreateAttendanceExceptionCommand> {
  constructor(private readonly attendanceExceptionProjection: AttendanceExceptionProjection) {}
  async execute(command: CreateAttendanceExceptionCommand): Promise<AttendanceException> {
    const { data, userId } = command;

    return await this.attendanceExceptionProjection.register(data, userId);
  }
}
