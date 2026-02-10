import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateEventAttendanceCommand } from "./update-eventAttendance.command";
import { EventAttendanceProjection } from "../../projections/eventAttendance.projection";

@CommandHandler(UpdateEventAttendanceCommand)
export class UpdateEventAttendanceHandler implements ICommandHandler<UpdateEventAttendanceCommand> {
  constructor(private readonly eventAttendanceProjection: EventAttendanceProjection) {}
  async execute(command: UpdateEventAttendanceCommand): Promise<{ count: number }> {
    const { id, userId } = command;
    return await this.eventAttendanceProjection.update(id, userId);
  }
}
