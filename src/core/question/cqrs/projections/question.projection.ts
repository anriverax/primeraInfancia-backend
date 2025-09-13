import { Injectable } from "@nestjs/common";
import { Question } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateQuestion, IDeleteQuestion, IUpdateQuestion } from "../../dto/question.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class QuestionProjection {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateQuestion): Promise<Question> {
    try {
      return await this.prisma.question.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("QuestionProjection", error);
    }
  }

  async update(data: IUpdateQuestion): Promise<Question> {
    const { id, ...props } = data;

    try {
      return await this.prisma.question.update({ where: { id }, data: props });
    } catch (error) {
      handlePrismaError("QuestionProjection", error);
    }
  }

  async delete(data: IDeleteQuestion): Promise<Question> {
    const { id, deletedBy } = data;

    try {
      return await this.prisma.softDelete("question", { id }, { deletedBy });
    } catch (error) {
      handlePrismaError("QuestionProjection", error);
    }
  }
}
