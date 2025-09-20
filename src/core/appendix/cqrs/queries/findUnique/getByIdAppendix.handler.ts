import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdAppendixQuery } from "./getByIdAppendix.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdAppendix } from "@/core/appendix/dto/appendix.type";

@QueryHandler(GetByIdAppendixQuery)
export class GetByIdAppendixHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdAppendixQuery): Promise<IGetByIdAppendix | null> {
    const appendixs = await this.prisma.appendix.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        title: true,
        subTitle: true,
        description: true
      }
    });

    return appendixs;
  }
}
