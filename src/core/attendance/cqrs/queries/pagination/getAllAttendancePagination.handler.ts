import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllAttendancePaginationQuery } from "./getAllAttendancePagination.query";
import { IAttendanceGroupedWithPagination } from "@/core/attendance/dto/attendance.type";
import { RoleType } from "@prisma/client";
import { formatDate } from "@/common/helpers/functions";

@QueryHandler(GetAllAttendancePaginationQuery)
export class GetAllAttendancePaginationHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllAttendancePaginationQuery): Promise<IAttendanceGroupedWithPagination> {
    const { responsableId, role } = query;
    const { page = 1, limit = 10 } = query.data;

    const whereClause =
      role !== RoleType.ADMIN && role !== RoleType.USER ? { createdBy: responsableId } : {};

    // Obtener todas las asistencias sin paginación primero para agrupar
    const allAttendances = await this.prisma.attendance.findMany({
      where: whereClause,
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
        status: true,
        modality: true,
        personRoleId: true,
        Event: {
          select: {
            name: true
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

    // Agrupar por persona
    const groupedByPerson = allAttendances.reduce(
      (acc, attendance) => {
        const personRoleId = attendance.personRoleId;
        const fullName = `${attendance.PersonRole.Person.firstName} ${attendance.PersonRole.Person.lastName1} ${attendance.PersonRole.Person.lastName2}`;

        if (!acc[personRoleId]) {
          acc[personRoleId] = {
            personRoleId,
            fullName,
            totalEvents: 0,
            events: []
          };
        }

        acc[personRoleId].totalEvents += 1;
        acc[personRoleId].events.push({
          id: attendance.id,
          eventName: attendance.Event.name,
          checkIn: formatDate(attendance.checkIn),
          checkOut: attendance.checkOut ? formatDate(attendance.checkOut) : null,
          status: attendance.status,
          modality: attendance.modality
        });

        return acc;
      },
      {} as Record<number, any>
    );

    // Convertir a array
    const groupedArray = Object.values(groupedByPerson);

    // Aplicar paginación
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
