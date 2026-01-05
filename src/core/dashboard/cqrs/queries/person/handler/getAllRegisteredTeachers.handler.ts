import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllRegisteredTeachersQuery } from "../queries/getAllRegisteredTeachers.query";
import { ITeacherStatus } from "@/core/dashboard/dto/dashboard.type";

@QueryHandler(GetAllRegisteredTeachersQuery)
export class GetAllRegisteredTeachersHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<ITeacherStatus> {
    let activeTeachers: number = 0;
    let inactiveTeachers: number = 0;

    const persons = await this.prisma.inscription.findMany({
      select: {
        deletedAt: true
      }
    });

    if (persons.length > 0) {
      activeTeachers = persons.filter((person) => person.deletedAt === null).length;
      inactiveTeachers = persons.filter((person) => person.deletedAt !== null).length;
    }

    return { active: activeTeachers, inactive: inactiveTeachers };
  }
}
