import { QueryHandler } from "@nestjs/cqrs";
import { GetAllModuleEvaluationQuery } from "./getAllModuleEvaluation.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IModuleEvaluationsWithPagination } from "@/core/moduleEvaluation/dto/moduleEvaluation.type";

@QueryHandler(GetAllModuleEvaluationQuery)
export class GetAllModuleEvaluationHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllModuleEvaluationQuery): Promise<IModuleEvaluationsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.moduleEvaluation.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          grade: true,
          comment: true,
          moduleProgressStatus: true,
          evaluationInstrumentId: true,
          enrollmentId: true,
          TrainingModule: {
            select: { moduleName: true }
          },
          evaluationInstrument: {
            select: {
              instrumentName: true
            }
          },
          enrollment: {
            select: {
              personRole: {
                select: {
                  person: {
                    select: {
                      firstName: true,
                      lastName1: true,
                      lastName2: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.moduleEvaluation.count()
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
