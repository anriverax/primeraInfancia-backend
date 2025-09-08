import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateAttendanceCommand } from "./createAttendance.command";
import { AttendanceProjection } from "../../projections/attendance.projection";
import { IAttendanceResult } from "@/core/attendance/dto/attendance.type";

@CommandHandler(CreateAttendanceCommand)
export class CreateAttendanceHandler implements ICommandHandler<CreateAttendanceCommand> {
  constructor(private readonly projection: AttendanceProjection) {}

  async execute(command: CreateAttendanceCommand): Promise<IAttendanceResult> {
    const { data, userId } = command;

    return await this.projection.register(data, userId);
  }
}
