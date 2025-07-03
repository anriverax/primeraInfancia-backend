import { QueryHandler } from "@nestjs/cqrs";
import { GetAllMunicipalityQuery } from "./getAllMunicipality.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Municipality } from "@prisma/client";

@QueryHandler(GetAllMunicipalityQuery)
export class GetAllMunicipalityHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<Municipality[]> {
    const municipality = await this.prisma.municipality.findMany({
      include: {
        Department: true
      },
      orderBy: {
        id: "asc"
      }
    });

    return municipality;
  }
}
