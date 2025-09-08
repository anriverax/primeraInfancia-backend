import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AttendanceProjection } from "../../projections/attendance.projection";
import { UpdateAttendanceCommand } from "./updateAttendance.command";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(UpdateAttendanceCommand)
export class UpdateAttendanceHandler implements ICommandHandler<UpdateAttendanceCommand> {
  constructor(private readonly attendanceProjection: AttendanceProjection) {}

  async execute(command: UpdateAttendanceCommand): Promise<NestResponse<void>> {
    const { id, userId } = command;

    await this.attendanceProjection.update(id, userId);

    return {
      statusCode: 200,
      message: "Asistencia actualizada con éxito."
    };
  }
}
