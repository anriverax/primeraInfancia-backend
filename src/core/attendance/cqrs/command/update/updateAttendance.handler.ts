import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AttendanceProjection } from "../../projections/attendance.projection";
import { UpdateAttendanceCommand } from "./updateAttendance.command";

@CommandHandler(UpdateAttendanceCommand)
export class UpdateAttendanceHandler implements ICommandHandler<UpdateAttendanceCommand> {
  constructor(private readonly attendanceProjection: AttendanceProjection) {}

  async execute(command: UpdateAttendanceCommand): Promise<{ count: number }> {
    const { id, userId } = command;

    return await this.attendanceProjection.update(id, userId);
  }
}
