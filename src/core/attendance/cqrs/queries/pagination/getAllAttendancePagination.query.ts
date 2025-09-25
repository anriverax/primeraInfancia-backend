import { IPaginatedQueryParams } from "@/common/helpers/types";
import { IAttendanceWithPagination } from "@/core/attendance/dto/attendance.type";
import { Query } from "@nestjs/cqrs";

export class GetAllAttendancePaginationQuery extends Query<IAttendanceWithPagination> {
  constructor(
    public readonly responsableId: number,
    public readonly data: IPaginatedQueryParams
  ) {
    super();
  }
}
