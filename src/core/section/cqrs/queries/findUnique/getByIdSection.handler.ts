import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdSectionQuery } from "./getByIdSection.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdSection } from "@/core/section/dto/section.type";

@QueryHandler(GetByIdSectionQuery)
export class GetByIdSectionHandler {
  constructor(private readonly prisma: PrismaService) {}
/* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(query: GetByIdSectionQuery): Promise<IGetByIdSection | null> {
    const sections = await this.prisma.section.findUnique({
      where: { id: query.id },
      select: {
        id : true,
        title : true, summary : true, orderBy : true, instrumentId : true,
      }
    });

    return sections;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
