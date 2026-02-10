import { Command } from "@nestjs/cqrs";
import { IPlannedEventData } from "../dto/plannedEvent.type";

export class UpdatePlannedEventCommand extends Command<number> {
  constructor(
    public readonly id: number,
    public readonly data: IPlannedEventData,
    public readonly userId: number
  ) {
    super();
  }
}
