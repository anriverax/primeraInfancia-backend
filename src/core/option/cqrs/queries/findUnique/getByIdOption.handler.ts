import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdOptionQuery } from "./getByIdOption.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdOption } from "@/core/option/dto/option.type";

@QueryHandler(GetByIdOptionQuery)
export class GetByIdOptionHandler {
  constructor(private readonly prisma: PrismaService) {}
/* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(query: GetByIdOptionQuery): Promise<IGetByIdOption | null> {
    const options = await this.prisma.option.findUnique({
      where: { id: query.id },
      select: {
        id : true,
        text : true, value : true, questionId : true,
      }
    });

    return options;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
