import { QueryHandler } from "@nestjs/cqrs";
import { GetAllTrainingEvaluationQuery } from "./getAllTrainingEvaluation.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { ITrainingEvaluationsWithPagination } from "@/core/trainingEvaluation/dto/trainingEvaluation.type";

@QueryHandler(GetAllTrainingEvaluationQuery)
export class GetAllTrainingEvaluationHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllTrainingEvaluationQuery): Promise<ITrainingEvaluationsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.trainingEvaluation.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          grade: true,
          evaluationInstrumentId: true,
          inscriptionId: true,
          Inscription: {
            select: {
              PersonRole: {
                select: {
                  Person: {
                    select: {
                      firstName: true,
                      lastName1: true,
                      lastName2: true
                    }
                  }
                }
              }
            }
          },
          EvaluationInstrument: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.trainingEvaluation.count()
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
