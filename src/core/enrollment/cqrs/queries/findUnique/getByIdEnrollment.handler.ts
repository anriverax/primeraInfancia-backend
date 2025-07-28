import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdEnrollmentQuery } from "./getByIdEnrollment.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdEnrollment } from "@/core/enrollment/dto/enrollment.type";

@QueryHandler(GetByIdEnrollmentQuery)
export class GetByIdEnrollmentHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdEnrollmentQuery): Promise<IGetByIdEnrollment | null> {
    const Enrollments = await this.prisma.enrollment.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        teacherId: true,
        groupId: true,
        administrativeStatus: true
      }
    });

    return Enrollments;
  }
}
