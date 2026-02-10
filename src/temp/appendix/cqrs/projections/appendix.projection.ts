import { Injectable } from "@nestjs/common";
import { Appendix } from "prisma/generated/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateAppendix, IDeleteAppendix, IUpdateAppendix } from "../../dto/appendix.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class AppendixProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateAppendix): Promise<Appendix> {
    try {
      return await this.prisma.appendix.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("AppendixProjection", error);
    }
  }

  async update(data: IUpdateAppendix): Promise<Appendix> {
    const { id, ...props } = data;

    try {
      return await this.prisma.appendix.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("AppendixProjection", error);
    }
  }

  async delete(data: IDeleteAppendix): Promise<Appendix> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("appendix", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("AppendixProjection", error);
    }
  }
}
