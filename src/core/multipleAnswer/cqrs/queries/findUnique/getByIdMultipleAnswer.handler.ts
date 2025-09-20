import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdMultipleAnswerQuery } from "./getByIdMultipleAnswer.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdMultipleAnswer } from "@/core/multipleAnswer/dto/multipleAnswer.type";

@QueryHandler(GetByIdMultipleAnswerQuery)
export class GetByIdMultipleAnswerHandler {
  constructor(private readonly prisma: PrismaService) { }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(query: GetByIdMultipleAnswerQuery): Promise<IGetByIdMultipleAnswer | null> {
    const multipleAnswers = await this.prisma.multipleAnswer.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        answerId: true, optionId: true,
      }
    });

    return multipleAnswers;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
