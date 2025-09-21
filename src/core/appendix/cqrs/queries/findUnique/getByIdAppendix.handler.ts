import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdAppendixQuery, GetByDetailAppendixQuery } from "./getByIdAppendix.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdAppendix, IGetByIdAppendixDetail } from "@/core/appendix/dto/appendix.type";

@QueryHandler(GetByIdAppendixQuery)
export class GetByIdAppendixHandler {
  constructor(private readonly prisma: PrismaService) { }

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

@QueryHandler(GetByDetailAppendixQuery)
export class GetByIdDetailAppendixHandler {
  constructor(private readonly prisma: PrismaService) { }

  async execute(query: GetByDetailAppendixQuery): Promise<IGetByIdAppendixDetail | null> {
    const appendixs = await this.prisma.appendix.findUnique({
      where: { id: query.id },
      include: {
        Section: {
          include: {
            Question: {
              include: {
                Option: {
                  include: {
                    DetailOption: true
                  }
                }
              }
            }
          }
        }
      }
    });

    return appendixs;
  }
}
