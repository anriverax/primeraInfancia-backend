import { QueryHandler } from "@nestjs/cqrs";
import { GetAllEventQuery } from "./getAllEvent.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetAllEvent } from "../../../dto/event.dto";

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
