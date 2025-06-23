import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Zone } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateZone, IDeleteZone, IUpdateZone } from "../../dto/zone.dto";

@Injectable({})
export class ZoneProjection {
  private readonly logger = new Logger("ZoneProjection");
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateZone): Promise<Zone> {
    try {
      return await this.prisma.zone.create({ data: { ...data } });
    } catch (error) {
      this.logger.error(`❌ Error de prisma: `, error);
      throw new BadRequestException("Se ha producido un error al procesar su solicitud.");
    }
  }

  async update(data: IUpdateZone): Promise<Zone> {
    const { id, name, updatedBy } = data;

    try {
      return await this.prisma.zone.update({ where: { id }, data: { name, updatedBy } });
    } catch (error) {
      this.logger.error(`❌ Error de prisma: `, error);
      throw new BadRequestException("Se ha producido un error al procesar su solicitud.");
    }
  }

  async delete(data: IDeleteZone): Promise<Zone> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("zone", { id }, { deletedBy });
    } catch (error) {
      this.logger.error(`❌ Error de prisma: `, error);
      throw new BadRequestException("Se ha producido un error al procesar su solicitud.");
    }
  }
}
