import { PrismaService } from "@/services/prisma/prisma.service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

export class GetAllSupportsByEventQuery {}

@QueryHandler(GetAllSupportsByEventQuery)
export class GetAllSupportsByEventHandler implements IQueryHandler<GetAllSupportsByEventQuery> {
  constructor(private readonly prisma: PrismaService) {}

  execute(): Promise<any[]> {
    return this.prisma.techSupportAssignments.findMany({
      where: {
        TechSupport: {
          Person: {
            User: { id: 2 }
          }
        }
      },
      select: {
        TechSupport: {
          select: {
            
          }
        }
      }
    });
  }
}
