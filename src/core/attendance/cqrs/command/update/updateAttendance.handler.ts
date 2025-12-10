import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateAttendanceCommand } from "./updateAttendance.command";
import { AttendanceSessionProjection } from "../../projections/attendanceSession.projection";

@CommandHandler(UpdateAttendanceCommand)
export class UpdateAttendanceHandler implements ICommandHandler<UpdateAttendanceCommand> {
  constructor(private readonly attendanceProjection: AttendanceSessionProjection) {}

  async execute(command: UpdateAttendanceCommand): Promise<{ count: number }> {
    const { id, userId } = command;

    return await this.attendanceProjection.update(id, userId);
  }
}
