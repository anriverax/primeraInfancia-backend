import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EventAttendance } from "prisma/generated/client";
import { CreateEventAttendanceCommand } from "./create-eventAttendance.command";
import { EventAttendanceProjection } from "../../projections/eventAttendance.projection";

@CommandHandler(CreateEventAttendanceCommand)
export class CreateEventAttendanceHandler implements ICommandHandler<CreateEventAttendanceCommand> {
  constructor(private readonly eventAttendanceProjection: EventAttendanceProjection) {}
  async execute(command: CreateEventAttendanceCommand): Promise<EventAttendance> {
    const { data, userId } = command;

    return await this.eventAttendanceProjection.register(data, userId);
  }
}
