import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AttendanceSessionProjection } from "../../projections/attendanceSession.projection";
import { UpdateAttendanceSessionCommand } from "./update-attendanceSession.command";

@CommandHandler(UpdateAttendanceSessionCommand)
export class UpdateAttendanceSessionHandler implements ICommandHandler<UpdateAttendanceSessionCommand> {
  constructor(private readonly attendanceSessionProjection: AttendanceSessionProjection) {}
  async execute(command: UpdateAttendanceSessionCommand): Promise<{ count: number }> {
    const { id } = command;
    return await this.attendanceSessionProjection.update(id);
  }
}
