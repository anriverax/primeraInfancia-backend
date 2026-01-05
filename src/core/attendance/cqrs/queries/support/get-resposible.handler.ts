import { PrismaService } from "@/services/prisma/prisma.service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllSupportResult } from "@/core/attendance/dto/attendance.type";
import { GetResposibleQuery } from "./get-responsible.query";

@QueryHandler(GetResposibleQuery)
export class GetResposibleHandler implements IQueryHandler<GetResposibleQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetResposibleQuery): Promise<GetAllSupportResult[]> {
    const { userId } = query;

    const resposible = await this.prisma.person.findFirst({
      where: {
        User: {
          id: userId
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName1: true,
        lastName2: true
      }
    });

    if (!resposible) return [];

    return [
      {
        id: resposible.id,
        fullName:
          `${resposible.firstName} ${resposible.lastName1}${resposible.lastName2 ? " " + resposible.lastName2 : ""}`.trim()
      }
    ];
  }
}
