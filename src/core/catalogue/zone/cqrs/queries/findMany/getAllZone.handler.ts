import { QueryHandler } from "@nestjs/cqrs";
import { GetAllZoneQuery } from "./getAllZone.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetZone } from "@/core/catalogue/zone/dto/zone.dto";

@QueryHandler(GetAllZoneQuery)
export class GetAllZoneHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<IGetZone[]> {
    const zones = await this.prisma.zone.findMany({
      select: {
        id: true,
        name: true
        /*_count: {
          select: {
            Group: true
          }
        }*/
      },
      orderBy: {
        id: "asc"
      }
    });

    return zones;
  }
}
