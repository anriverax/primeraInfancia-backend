import { Injectable } from "@nestjs/common";
import { Section } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateSection, IDeleteSection, IUpdateSection } from "../../dto/section.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class SectionProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateSection): Promise<Section> {
    try {
      return await this.prisma.section.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("SectionProjection", error);
    }
  }

  async update(data: IUpdateSection): Promise<Section> {
    const { id, ...props } = data;

    try {
      return await this.prisma.section.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("SectionProjection", error);
    }
  }

  async delete(data: IDeleteSection): Promise<Section> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("section", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("SectionProjection", error);
    }
  }
}
