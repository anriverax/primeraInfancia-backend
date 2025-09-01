import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdResponseSelectionOptionQuery } from "./getByIdResponseSelectionOption.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdResponseSelectionOption } from "@/core/responseSelectionOption/dto/responseSelectionOption.type";

@QueryHandler(GetByIdResponseSelectionOptionQuery)
export class GetByIdResponseSelectionOptionHandler {
  constructor(private readonly prisma: PrismaService) { }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(query: GetByIdResponseSelectionOptionQuery): Promise<IGetByIdResponseSelectionOption | null> {
    const responseSelectionOptions = await this.prisma.responseSelectionOption.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        answerId: true, optionId: true,
      }
    });

    return responseSelectionOptions;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
