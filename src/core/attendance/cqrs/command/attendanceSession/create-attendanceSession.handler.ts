import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateAttendanceSessionCommand } from "./create-attendanceSession.command";
import { AttendanceSessionProjection } from "../../projections/attendanceSession.projection";
import { AttendanceSession } from "prisma/generated/client";

@CommandHandler(CreateAttendanceSessionCommand)
export class CreateAttendanceSessionHandler implements ICommandHandler<CreateAttendanceSessionCommand> {
  constructor(private readonly attendanceSessionProjection: AttendanceSessionProjection) {}
  async execute(command: CreateAttendanceSessionCommand): Promise<AttendanceSession> {
    const { data, userId } = command;

    return await this.attendanceSessionProjection.register(data, userId);
  }
}
