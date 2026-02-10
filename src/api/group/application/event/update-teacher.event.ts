import { TeacherStatus } from "prisma/generated/enums";

export class UpdateTeacherEvent {
  constructor(
    public readonly id: number,
    public readonly data: {
      groupStaffId?: number;
      status?: TeacherStatus;
      updatedBy: number;
    }
  ) {}
}
