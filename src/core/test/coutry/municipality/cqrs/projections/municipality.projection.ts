import { BadRequestException, Injectable, Logger } from "@nestjs/common";

import { PrismaService } from "@/services/prisma/prisma.service";
import { IMunicipality } from "../../dto/municipality.type";
import { Municipality } from "prisma/generated/client";

@Injectable({})
export class MunicipalityProjection {
  private readonly logger = new Logger("MunicipalityProjection");
  constructor(private prisma: PrismaService) {}

  async add(data: IMunicipality): Promise<Municipality> {
    try {
      return await this.prisma.municipality.create({ data: { ...data } });
    } catch (error) {
      // Registrar o manejar adecuadamente otros errores de Prisma.
      this.logger.error(`❌ Error de prisma: `, error);

      throw new BadRequestException("Ocurrió un error al procesar su solicitud.");
    }
  }
}
