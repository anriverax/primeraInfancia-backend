import { QueryHandler } from "@nestjs/cqrs";
import { GetAllAppendixQuery } from "./getAllAppendix.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetAllAppendix } from "@/core/appendix/dto/appendix.type";

@QueryHandler(GetAllAppendixQuery)
export class GetAllAppendixHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<IGetAllAppendix[]> {
    const data = await this.prisma.appendix.findMany({
      select: {
        id: true,
        title: true,
        subTitle: true,
        description: true,
        periodicity: true,
        iconName: true,
        color: true
      },
      orderBy: {
        id: "asc"
      }
    });

    return data;
  }
}
