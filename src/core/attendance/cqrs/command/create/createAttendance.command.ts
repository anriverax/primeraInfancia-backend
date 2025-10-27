import { Command } from "@nestjs/cqrs";
import { IAttendanceInput, IAttendanceResult } from "@/core/attendance/dto/attendance.type";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AttendanceProjection } from "../../projections/attendance.projection";

export class CreateAttendanceCommand extends Command<IAttendanceResult> {
  constructor(
    public readonly data: IAttendanceInput,
    public readonly userId: number
  ) {
    super();
  }
}

@CommandHandler(CreateAttendanceCommand)
export class CreateAttendanceHandler implements ICommandHandler<CreateAttendanceCommand> {
  constructor(private readonly projection: AttendanceProjection) {}

  async execute(command: CreateAttendanceCommand): Promise<IAttendanceResult> {
    const { data, userId } = command;

    return await this.projection.register(data, userId);
  }
}
