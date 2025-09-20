import { Injectable } from "@nestjs/common";
import { MultipleAnswer } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateMultipleAnswer, IDeleteMultipleAnswer, IUpdateMultipleAnswer } from "../../dto/multipleAnswer.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class MultipleAnswerProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateMultipleAnswer): Promise<MultipleAnswer> {
    try {
      return await this.prisma.multipleAnswer.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("MultipleAnswerProjection", error);
    }
  }

  async update(data: IUpdateMultipleAnswer): Promise<MultipleAnswer> {
    const { id, ...props } = data;

    try {
      return await this.prisma.multipleAnswer.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("MultipleAnswerProjection", error);
    }
  }

  async delete(data: IDeleteMultipleAnswer): Promise<MultipleAnswer> {
    const { id, deletedBy  } = data;

    try {
      return await this.prisma.softDelete("multipleAnswer", { id }, { deletedBy  });
    } catch (error) {
      handlePrismaError("MultipleAnswerProjection", error);
    }
  }
}