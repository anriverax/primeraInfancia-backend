import { Injectable } from "@nestjs/common";
import { Evidence } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateEvidence, IDeleteEvidence, IUpdateEvidence } from "../../dto/evidence.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class EvidenceProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateEvidence): Promise<Evidence> {
    try {
      return await this.prisma.evidence.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("EvidenceProjection", error);
    }
  }

  async update(data: IUpdateEvidence): Promise<Evidence> {
    const { id, ...props } = data;

    try {
      return await this.prisma.evidence.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("EvidenceProjection", error);
    }
  }

  async delete(data: IDeleteEvidence): Promise<Evidence> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("evidence", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("EvidenceProjection", error);
    }
  }
}
