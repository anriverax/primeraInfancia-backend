import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllAttendancePaginationQuery } from "./getAllAttendancePagination.query";
import {
  IAttendanceGrouped,
  IAttendanceGroupedWithPagination,
  IAttendanceList
} from "@/core/attendance/dto/attendance.type";
import { RoleType } from "prisma/generated/client";

@QueryHandler(GetAllAttendancePaginationQuery)
export class GetAllAttendancePaginationHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllAttendancePaginationQuery): Promise<IAttendanceGroupedWithPagination> {
    const { responsableId, role } = query;
    const { page = 1, limit = 10 } = query.data;

    const whereClause =
      role !== RoleType.ADMIN && role !== RoleType.USER ? { createdBy: responsableId } : {};

    const allAttendances: IAttendanceList[] = await this.prisma.attendance.findMany({
      where: whereClause,
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
        status: true,
        modality: true,
        EventInstance: {
          select: {
            id: true
          }
        },
        PersonRole: {
          select: {
            id: true,
            Person: {
              select: {
                firstName: true,
                lastName1: true,
                lastName2: true
              }
            }
          }
        }
      },
      orderBy: {
        checkIn: "desc"
      }
    });

    // Group by person
    const groupedByPerson = allAttendances.reduce(
      (acc, attendance: IAttendanceList) => {
        const personRoleId = attendance.PersonRole.id;
        const fullName = `${attendance.PersonRole.Person.firstName} ${attendance.PersonRole.Person.lastName1} ${attendance.PersonRole.Person.lastName2}`;

        if (!acc[personRoleId]) {
          acc[personRoleId] = {
            personRoleId,
            fullName,
            totalEvents: 0
          };
        }

        acc[personRoleId].totalEvents += 1;

        return acc;
      },
      {} as Record<number, IAttendanceGrouped>
    );

    // Convert to array
    const groupedArray = Object.values(groupedByPerson) as IAttendanceGrouped[];

    // Apply pagination
    const total = groupedArray.length;
    const skip = (page - 1) * limit;
    const paginatedData = groupedArray.slice(skip, skip + limit);

    const lastPage = Math.ceil(total / limit);

    return {
      data: paginatedData,
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
