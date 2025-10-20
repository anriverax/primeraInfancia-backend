import { Injectable } from "@nestjs/common";
import { Answer } from "@prisma/client";

import { PrismaService } from "@/services/prisma/prisma.service";
import { ICreateAnswer } from "../../dto/answer.type";
import { handlePrismaError } from "@/common/helpers/functions";

@Injectable()
export class AnswerProjection {
  constructor(private prisma: PrismaService) { }

  async create(data: ICreateAnswer): Promise<Answer> {
    try {
      return await this.prisma.answer.create({ data: { ...data } });
    } catch (error) {
      handlePrismaError("AnswerProjection", error);
    }
  }
}
