import { QueryHandler } from "@nestjs/cqrs";
import { GetAllZoneQuery } from "./getAllZone.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetZone, IGetZoneWithDept } from "@/core/catalogue/zone/dto/zone.type";

@QueryHandler(GetAllZoneQuery)
export class GetAllZoneHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<IGetZoneWithDept[]> {
    const zones = await this.prisma.zone.findMany({
      select: {
        id: true,
        name: true,
        Department: {
          select: {
            name: true,
            _count: {
              select: {
                Group: true
              }
            }
          }
        }
      },
      orderBy: {
        id: "asc"
      }
    });

    const result = zones.map((z: IGetZone) => {
      const d = z.Department.map((d) => `${d.name} (${d._count.Group}G)`);
      const t = z.Department.map((d) => d._count.Group);

      return {
        id: z.id,
        name: z.name,
        departmets: d.toString().replaceAll(",", ", "),
        total: t.reduce((acc: number, val: number) => acc + val, 0)
      };
    });

    return result;
  }
}
