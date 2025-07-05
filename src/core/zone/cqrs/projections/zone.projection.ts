import { Injectable } from "@nestjs/common";
import { Zone } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateZone, IDeleteZone, IUpdateZone } from "../../dto/zone.dto";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class ZoneProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateZone): Promise<Zone> {
    try {
      return await this.prisma.zone.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("ZoneProjection", error);
    }
  }

  async update(data: IUpdateZone): Promise<Zone> {
    const { id, name, updatedBy } = data;

    try {
      return await this.prisma.zone.update({ where: { id }, data: { name, updatedBy } });
    } catch (error) {
      handlePrismaError("ZoneProjection", error);
    }
  }

  async delete(data: IDeleteZone): Promise<Zone> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("zone", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("ZoneProjection", error);
    }
  }
}
