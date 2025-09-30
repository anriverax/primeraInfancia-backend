import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllEventQuery } from "./getAllEvent.query";
import { IGetAllEvent } from "@/core/attendance/dto/attendance.type";

@QueryHandler(GetAllEventQuery)
export class GetAllEventHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllEventQuery): Promise<IGetAllEvent[]> {
    const { responsableId } = query;

    const events = await this.prisma.event.findMany({
      where: {
        PersonRole: {
          Person: {
            User: {
              id: responsableId
            }
          }
        }
      },
      select: {
        id: true,
        name: true
      },
      orderBy: {
        id: "asc"
      }
    });

    return events;
  }
}
