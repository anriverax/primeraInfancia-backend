import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdAppendixTestQuery } from "./getByIdAppendixTest.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdAppendixTest } from "@/core/appendixTest/dto/appendixTest.type";

@QueryHandler(GetByIdAppendixTestQuery)
export class GetByIdAppendixTestHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdAppendixTestQuery): Promise<IGetByIdAppendixTest | null> {
    const appendixs = await this.prisma.appendixTest.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        name: true,
        textQuestion: true,
        textAnswer: true,
        teacherRoleId: true,
        mentorRoleId: true
      }
    });

    return appendixs;
  }
}
