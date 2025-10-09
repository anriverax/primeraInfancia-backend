import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdAnswerQuery } from "./getByIdAnswer.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdAnswer } from "@/core/answer/dto/answer.type";

@QueryHandler(GetByIdAnswerQuery)
export class GetByIdAnswerHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdAnswerQuery): Promise<IGetByIdAnswer | null> {
    const answers = await this.prisma.answer.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        valueText: true,
        questionId: true,
        inscriptionId: true
      }
    });

    return answers;
  }
}
