import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllTeacherByNipQuery } from "../../person/queries/getAllTeacherByNip.query";

@QueryHandler(GetAllTeacherByNipQuery)
export class GetAllTeacherByNipHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<number> {
    const teachersByNip = await this.prisma.academic.findMany({
      where: {
        nip: {
          gt: 0 // "greater than 0"
        },
        Person: {
          PersonRole: {
            some: {
              typePersonId: 2
            }
          }
        }
      },
      select: {
        id: true
      }
    });

    return teachersByNip.length;
  }
}
