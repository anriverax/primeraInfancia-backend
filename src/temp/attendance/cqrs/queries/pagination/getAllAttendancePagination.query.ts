import { IPaginatedQueryParams } from "@/common/helpers/types";
import { Query } from "@nestjs/cqrs";
import { RoleType } from "prisma/generated/client";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export class GetAllAttendancePaginationQuery extends Query<any> {
  constructor(
    public readonly responsableId: number,
    public readonly role: RoleType,
    public readonly data: IPaginatedQueryParams
  ) {
    super();
  }
}
