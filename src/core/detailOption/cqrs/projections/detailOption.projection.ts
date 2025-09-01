import { Injectable } from "@nestjs/common";
import { DetailOption } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import {
  ICreateDetailOption,
  IDeleteDetailOption,
  IUpdateDetailOption
} from "../../dto/detailOption.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class DetailOptionProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateDetailOption): Promise<DetailOption> {
    try {
      return await this.prisma.detailOption.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("DetailOptionProjection", error);
    }
  }

  async update(data: IUpdateDetailOption): Promise<DetailOption> {
    const { id, ...props } = data;

    try {
      return await this.prisma.detailOption.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("DetailOptionProjection", error);
    }
  }

  async delete(data: IDeleteDetailOption): Promise<DetailOption> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("detailOption", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("DetailOptionProjection", error);
    }
  }
}
