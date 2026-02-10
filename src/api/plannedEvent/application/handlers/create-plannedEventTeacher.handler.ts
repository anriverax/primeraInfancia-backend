import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePlannedEventTeacherCommand } from "../command/create-plannedEventTeacher.command";
import { PlannedEventTeacherProjection } from "../projections/plannedEventTeacher.projection";

@CommandHandler(CreatePlannedEventTeacherCommand)
export class CreatePlannedEventTeacherHandler implements ICommandHandler<CreatePlannedEventTeacherCommand> {
  constructor(private readonly plannedEventTeacherProjection: PlannedEventTeacherProjection) {}
  async execute(command: CreatePlannedEventTeacherCommand): Promise<void> {
    const { data, userId } = command;
    return await this.plannedEventTeacherProjection.create(data, userId);
  }
}
