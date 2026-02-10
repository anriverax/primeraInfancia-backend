import { IQueryHandler } from "@nestjs/cqrs";
import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Prisma } from "prisma/generated/client";
import { stringsToJson } from "@/common/helpers/functions";
import { IGetAllAppendix } from "../../dto/appendix.type";

export class GetAllAppendixQuery {
  constructor(public readonly selectProperties: string[] = []) {}
}

@QueryHandler(GetAllAppendixQuery)
export class GetAllAppendixHandler implements IQueryHandler<GetAllAppendixQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllAppendixQuery): Promise<IGetAllAppendix[]> {
    const { selectProperties } = query;

    const selectObj =
      selectProperties.length > 0
        ? stringsToJson(selectProperties)
        : stringsToJson([
            "id",
            "title",
            "subTitle",
            "description",
            "periodicity",
            "iconName",
            "color",
            "total"
          ]);

    const data = await this.prisma.appendix.findMany({
      select: selectObj as Prisma.AppendixSelect,
      orderBy: {
        id: "asc"
      }
    });

    return data;
  }
}
