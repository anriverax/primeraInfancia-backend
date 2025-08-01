import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdZoneQuery } from "./getByIdZone.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetZone } from "@/core/catalogue/zone/dto/zone.dto";

@QueryHandler(GetByIdZoneQuery)
export class GetByIdZoneHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdZoneQuery): Promise<IGetZone | null> {
    const zones = await this.prisma.zone.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            Group: true
          }
        }
      }
    });

    return zones;
  }
}
