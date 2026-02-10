import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePlannedEventCommand } from "../command/create-plannedEvent.command";
import { PlannedEventProjection } from "../projections/plannedEvent.projection";

@CommandHandler(CreatePlannedEventCommand)
export class CreatePlannedEventHandler implements ICommandHandler<CreatePlannedEventCommand> {
  constructor(private readonly plannedEventProjection: PlannedEventProjection) {}
  async execute(command: CreatePlannedEventCommand): Promise<number> {
    const { data, userId } = command;

    return await this.plannedEventProjection.create(data, userId);
  }
}
