import { IPaginatedQueryParams } from "@/common/helpers/types";
import { IAttendanceWithPagination } from "@/core/attendance/dto/attendance.type";
import { Query } from "@nestjs/cqrs";
import { RoleType } from "@prisma/client";

export class GetAllAttendancePaginationQuery extends Query<IAttendanceWithPagination> {
  constructor(
    public readonly responsableId: number,
    public readonly role: RoleType,
    public readonly data: IPaginatedQueryParams
  ) {
    super();
  }
}
