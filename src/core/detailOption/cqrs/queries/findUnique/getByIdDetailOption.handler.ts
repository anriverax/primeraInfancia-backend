import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdDetailOptionQuery } from "./getByIdDetailOption.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdDetailOption } from "@/core/detailOption/dto/detailOption.type";

@QueryHandler(GetByIdDetailOptionQuery)
export class GetByIdDetailOptionHandler {
  constructor(private readonly prisma: PrismaService) { }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(query: GetByIdDetailOptionQuery): Promise<IGetByIdDetailOption | null> {
    const detailOptions = await this.prisma.detailOption.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        textToDisplay: true, optionId: true,
      }
    });

    return detailOptions;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
