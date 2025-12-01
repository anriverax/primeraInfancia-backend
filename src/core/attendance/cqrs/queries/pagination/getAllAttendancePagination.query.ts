import { IPaginatedQueryParams } from "@/common/helpers/types";
import { IAttendanceGroupedWithPagination } from "@/core/attendance/dto/attendance.type";
import { Query } from "@nestjs/cqrs";
import { RoleType } from "prisma/generated/client";

export class GetAllAttendancePaginationQuery extends Query<IAttendanceGroupedWithPagination> {
  constructor(
    public readonly responsableId: number,
    public readonly role: RoleType,
    public readonly data: IPaginatedQueryParams
  ) {
    super();
  }
}
