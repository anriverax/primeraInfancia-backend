import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdAnswerQuery } from "./getByIdAnswer.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdAnswer } from "@/core/answer/dto/answer.type";

@QueryHandler(GetByIdAnswerQuery)
export class GetByIdAnswerHandler {
  constructor(private readonly prisma: PrismaService) {}
/* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(query: GetByIdAnswerQuery): Promise<IGetByIdAnswer | null> {
    const answers = await this.prisma.answer.findUnique({
      where: { id: query.id },
      select: {
        id : true,
        answerDetail : true, questionId : true, responseSessionId : true,
      }
    });

    return answers;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
