import { GroupStaffByUser } from "@/temp/attendance/dto/attendance.type";
import { Query } from "@nestjs/cqrs";

export class GetGroupStaffByUserQuery extends Query<GroupStaffByUser[] | []> {
  constructor(public readonly userId: number) {
    super();
  }
}
