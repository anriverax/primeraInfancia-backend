import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllMentorQuery } from "./getAllMentor.query";
import { IMentor } from "@/core/group/dto/group.type";

@QueryHandler(GetAllMentorQuery)
export class GetAllMentorHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllMentorQuery): Promise<IMentor[]> {
    const { departmentId } = query;

    const mentors = await this.prisma.personRole.findMany({
      where: {
        typePersonId: 5,
        Person: {
          deletedAt: null,
          WorkAssignment: { some: { deletedAt: null, Municipality: { departmentId } } }
        }
      },
      select: {
        id: true,
        Person: {
          select: {
            WorkAssignment: {
              select: {
                Municipality: {
                  select: { id: true, name: true }
                }
              }
            }
          }
        }
      }
    });

    return mentors;
  }
}
