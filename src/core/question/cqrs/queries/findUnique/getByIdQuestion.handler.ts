import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdQuestionQuery } from "./getByIdQuestion.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdQuestion } from "@/core/question/dto/question.type";

@QueryHandler(GetByIdQuestionQuery)
export class GetByIdQuestionHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdQuestionQuery): Promise<IGetByIdQuestion | null> {
    const questions = await this.prisma.question.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        text: true,
        questionType: true,
        orderBy: true,
        subSection: true,
        isRequired: true,
        sectionId: true
      }
    });

    return questions;
  }
}
