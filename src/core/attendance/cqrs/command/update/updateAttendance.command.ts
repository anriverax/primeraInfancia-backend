import { NestResponse } from '@/common/helpers/types';
import { Command } from "@nestjs/cqrs";

export class UpdateAttendanceCommand extends Command<NestResponse<void>> {
  constructor(
    public readonly id: number,
    public readonly userId: number
  ) {
    super();
  }
}
