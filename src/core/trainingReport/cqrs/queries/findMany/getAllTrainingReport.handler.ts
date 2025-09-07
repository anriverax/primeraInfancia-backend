import { QueryHandler } from "@nestjs/cqrs";
import { GetAllTrainingReportQuery } from "./getAllTrainingReport.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { ITrainingReportsWithPagination } from "@/core/trainingReport/dto/trainingReport.type";

@QueryHandler(GetAllTrainingReportQuery)
export class GetAllTrainingReportHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllTrainingReportQuery): Promise<ITrainingReportsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.trainingReport.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          finalScore: true,
          status: true,
          remark: true
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.trainingReport.count()
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
