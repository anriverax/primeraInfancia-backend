import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdResponseSessionQuery } from "./getByIdResponseSession.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdResponseSession } from "@/core/responseSession/dto/responseSession.type";

@QueryHandler(GetByIdResponseSessionQuery)
export class GetByIdResponseSessionHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdResponseSessionQuery): Promise<IGetByIdResponseSession | null> {
    const responseSessions = await this.prisma.responseSession.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        status: true
        // inscriptionId: true,
        // instrumentId: true,
        // trackingId: true
      }
    });

    return responseSessions;
  }
}
