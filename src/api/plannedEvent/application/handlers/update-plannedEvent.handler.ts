import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PlannedEventProjection } from "../projections/plannedEvent.projection";
import { UpdatePlannedEventCommand } from "../command/update-plannedEvent.command";

@CommandHandler(UpdatePlannedEventCommand)
export class UpdatePlannedEventHandler implements ICommandHandler<UpdatePlannedEventCommand> {
  constructor(private readonly plannedEventProjection: PlannedEventProjection) {}
  async execute(command: UpdatePlannedEventCommand): Promise<number> {
    const { data, userId, id } = command;

    return await this.plannedEventProjection.update(id, data, userId);
  }
}
