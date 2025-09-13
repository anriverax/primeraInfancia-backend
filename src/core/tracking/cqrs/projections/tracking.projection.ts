import { Injectable } from "@nestjs/common";
import { Tracking } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateTracking, IDeleteTracking, IUpdateTracking } from "../../dto/tracking.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class TrackingProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateTracking): Promise<Tracking> {
    try {
      return await this.prisma.tracking.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("TrackingProjection", error);
    }
  }

  async update(data: IUpdateTracking): Promise<Tracking> {
    const { id, ...props } = data;

    try {
      return await this.prisma.tracking.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("TrackingProjection", error);
    }
  }

  async delete(data: IDeleteTracking): Promise<Tracking> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("tracking", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("TrackingProjection", error);
    }
  }
}
