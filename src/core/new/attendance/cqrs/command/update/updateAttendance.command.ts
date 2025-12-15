import { Command } from "@nestjs/cqrs";

export class UpdateAttendanceCommand extends Command<{ count: number }> {
  constructor(
    public readonly id: number,
    public readonly userId: number
  ) {
    super();
  }
}
