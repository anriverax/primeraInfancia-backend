import { Injectable } from "@nestjs/common";
import { TrackingType } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import {
  ICreateTrackingType,
  IDeleteTrackingType,
  IUpdateTrackingType
} from "../../dto/trackingType.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class TrackingTypeProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateTrackingType): Promise<TrackingType> {
    try {
      return await this.prisma.trackingType.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("TrackingTypeProjection", error);
    }
  }

  async update(data: IUpdateTrackingType): Promise<TrackingType> {
    const { id, ...props } = data;

    try {
      return await this.prisma.trackingType.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("TrackingTypeProjection", error);
    }
  }

  async delete(data: IDeleteTrackingType): Promise<TrackingType> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("trackingType", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("TrackingTypeProjection", error);
    }
  }
}
