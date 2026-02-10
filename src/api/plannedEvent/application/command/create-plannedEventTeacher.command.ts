import { Command } from "@nestjs/cqrs";
import { IPlannedEventTeacherData } from "../dto/plannedEvent.type";

export class CreatePlannedEventTeacherCommand extends Command<void> {
  constructor(
    public readonly data: IPlannedEventTeacherData,
    public readonly userId: number
  ) {
    super();
  }
}
