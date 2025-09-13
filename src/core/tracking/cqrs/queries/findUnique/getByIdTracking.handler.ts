import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdTrackingQuery } from "./getByIdTracking.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdTracking } from "@/core/tracking/dto/tracking.type";

@QueryHandler(GetByIdTrackingQuery)
export class GetByIdTrackingHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdTrackingQuery): Promise<IGetByIdTracking | null> {
    const trackings = await this.prisma.tracking.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        name: true,
        description: true,
        start: true,
        finish: true,
        trackingTypeId: true
      }
    });

    return trackings;
  }
}
