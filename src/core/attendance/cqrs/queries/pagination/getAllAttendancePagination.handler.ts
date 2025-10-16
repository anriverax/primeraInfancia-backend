import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllAttendancePaginationQuery } from "./getAllAttendancePagination.query";
import { IAttendanceWithPagination } from "@/core/attendance/dto/attendance.type";
import { RoleType } from "@prisma/client";

@QueryHandler(GetAllAttendancePaginationQuery)
export class GetAllAttendancePaginationHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllAttendancePaginationQuery): Promise<IAttendanceWithPagination> {
    const { responsableId, role } = query;
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;

    const whereClause =
      role !== RoleType.ADMIN && role !== RoleType.USER ? { createdBy: responsableId } : {};

    const [data, total] = await Promise.all([
      this.prisma.attendance.findMany({
        where: whereClause,
        skip,
        take: limit,
        select: {
          id: true,
          checkIn: true,
          checkOut: true,
          status: true,
          comment: true,
          justificationUrl: true,
          modality: true,
          Event: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.attendance.count({
        where: {
          PersonRole: {
            Person: {
              User: {
                id: query.responsableId
              }
            }
          }
        }
      })
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        currentPage: page,
        perPage: limit,
        lastPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null
      }
    };
  }
}
