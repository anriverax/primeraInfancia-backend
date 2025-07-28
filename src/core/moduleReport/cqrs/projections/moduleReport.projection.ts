import { Injectable } from "@nestjs/common";
import { ModuleReport } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import {
  ICreateModuleReport,
  IDeleteModuleReport,
  IUpdateModuleReport
} from "../../dto/moduleReport.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class ModuleReportProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateModuleReport): Promise<ModuleReport> {
    try {
      return await this.prisma.moduleReport.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("ModuleReportProjection", error);
    }
  }

  async update(data: IUpdateModuleReport): Promise<ModuleReport> {
    const { id, ...props } = data;

    try {
      return await this.prisma.moduleReport.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("ModuleReportProjection", error);
    }
  }

  async delete(data: IDeleteModuleReport): Promise<ModuleReport> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("moduleReport", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("ModuleReportProjection", error);
    }
  }
}
