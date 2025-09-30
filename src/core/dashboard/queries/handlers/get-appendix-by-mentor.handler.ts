import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAppendixByMentorQuery } from "../get-appendix-by-mentor.query";

@QueryHandler(GetAppendixByMentorQuery)
export class GetAppendixByMentorHandler implements IQueryHandler<GetAppendixByMentorQuery> {
  constructor(private prisma: PrismaService) {}

  /* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(): Promise<any> {
    // Filtrar por 'Anexo 8'
     const results = await this.prisma.appendixTest.groupBy({
  by: ['name'],
  _count: {
    _all: true, // This alias calculates the number of rows per 'name' group
  },
});
    return results;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
