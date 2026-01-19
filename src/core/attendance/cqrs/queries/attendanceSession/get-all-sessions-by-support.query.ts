import { AttendanceSessionList } from "@/core/attendance/dto/attendance.type";
import { Query } from "@nestjs/cqrs";
import { RoleType } from "prisma/generated/client";
export class GetAllSessionsBySupportQuery extends Query<AttendanceSessionList[]> {
  constructor(
    public readonly userId: number,
    public readonly role: RoleType
  ) {
    super();
  }
}
