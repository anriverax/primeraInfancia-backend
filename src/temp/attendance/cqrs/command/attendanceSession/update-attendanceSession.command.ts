import { Command } from "@nestjs/cqrs";

export class UpdateAttendanceSessionCommand extends Command<{ count: number }> {
  constructor(public readonly id: number) {
    super();
  }
}
