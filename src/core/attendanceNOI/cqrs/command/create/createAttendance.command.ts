import { Command } from "@nestjs/cqrs";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AttendanceSessionProjection } from "../../projections/attendanceSession.projection";
/* eslint-disable @typescript-eslint/no-explicit-any */
export class CreateAttendanceCommand extends Command<any> {
  constructor(
    public readonly data: any,
    public readonly userId: number
  ) {
    super();
  }
}

@CommandHandler(CreateAttendanceCommand)
export class CreateAttendanceHandler implements ICommandHandler<CreateAttendanceCommand> {
  constructor(private readonly projection: AttendanceSessionProjection) {}

  async execute(command: CreateAttendanceCommand): Promise<any> {
    const { data, userId } = command;

    return await this.projection.register(data, userId);
  }
}
