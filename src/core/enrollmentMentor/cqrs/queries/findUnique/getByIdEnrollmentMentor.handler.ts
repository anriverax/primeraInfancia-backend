import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdEnrollmentMentorQuery } from "./getByIdEnrollmentMentor.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdEnrollmentMentor } from "@/core/enrollmentMentor/dto/enrollmentMentor.type";

@QueryHandler(GetByIdEnrollmentMentorQuery)
export class GetByIdEnrollmentMentorHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdEnrollmentMentorQuery): Promise<IGetByIdEnrollmentMentor | null> {
    const EnrollmentMentors = await this.prisma.enrollmentMentor.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        enrollmentId: true,
        mentorId: true
      }
    });

    return EnrollmentMentors;
  }
}
