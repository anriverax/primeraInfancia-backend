import { QueryHandler } from "@nestjs/cqrs";
import { GetAllEvaluationInstrumentQuery } from "./getAllEvaluationInstrument.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IEvaluationInstrumentsWithPagination } from "@/core/evaluationInstrument/dto/evaluationInstrument.type";

@QueryHandler(GetAllEvaluationInstrumentQuery)
export class GetAllEvaluationInstrumentHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllEvaluationInstrumentQuery): Promise<IEvaluationInstrumentsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.evaluationInstrument.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          code: true,
          name: true,
          periodicity: true,
          percentage: true
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.evaluationInstrument.count()
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        currentPage: page,
        perPage: limit,
        lastPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null
      }
    };
  }
}
