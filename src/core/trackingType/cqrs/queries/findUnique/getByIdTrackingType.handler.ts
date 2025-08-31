import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdTrackingTypeQuery } from "./getByIdTrackingType.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdTrackingType } from "@/core/trackingType/dto/trackingType.type";

@QueryHandler(GetByIdTrackingTypeQuery)
export class GetByIdTrackingTypeHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdTrackingTypeQuery): Promise<IGetByIdTrackingType | null> {
    const trackingTypes = await this.prisma.trackingType.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        name: true,
        deliveryMethod: true
      }
    });

    return trackingTypes;
  }
}
