import { Injectable } from "@nestjs/common";
import { Answer } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateAnswer, IDeleteAnswer, IUpdateAnswer } from "../../dto/answer.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class AnswerProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateAnswer): Promise<Answer> {
    try {
      return await this.prisma.answer.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("AnswerProjection", error);
    }
  }

  async update(data: IUpdateAnswer): Promise<Answer> {
    const { id, ...props } = data;

    try {
      return await this.prisma.answer.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("AnswerProjection", error);
    }
  }

  async delete(data: IDeleteAnswer): Promise<Answer> {
    const { id, deletedBy  } = data;

    try {
      return await this.prisma.softDelete("answer", { id }, { deletedBy  });
    } catch (error) {
      handlePrismaError("AnswerProjection", error);
    }
  }
}