import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdAppendixQuery, GetByDetailAppendixQuery } from "./getByIdAppendix.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdAppendix, IGetByIdAppendixDetail } from "@/core/appendix/dto/appendix.type";

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

@QueryHandler(GetByDetailAppendixQuery)
export class GetByIdDetailAppendixHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByDetailAppendixQuery): Promise<IGetByIdAppendixDetail | null> {
    const appendixs = await this.prisma.appendix.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        title: true,
        subTitle: true,
        description: true,
        Section: {
          select: {
            title: true,
            summary: true,
            orderBy: true,
            Question: {
              select: {
                fieldName: true,
                text: true,
                questionType: true,
                orderBy: true,
                subSection: true,
                isRequired: true,
                Option: {
                  select: {
                    text: true,
                    value: true,
                    DetailOption: {
                      select: {
                        textToDisplay: true
                      }
                    }
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
