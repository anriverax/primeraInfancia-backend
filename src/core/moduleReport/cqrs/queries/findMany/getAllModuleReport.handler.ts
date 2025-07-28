import { QueryHandler } from "@nestjs/cqrs";
import { GetAllModuleReportQuery } from "./getAllModuleReport.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IModuleReportsWithPagination } from "@/core/moduleReport/dto/moduleReport.type";

@QueryHandler(GetAllModuleReportQuery)
export class GetAllModuleReportHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllModuleReportQuery): Promise<IModuleReportsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.moduleReport.findMany({
        skip,
        take: limit,
        select: {
          id : true,
          moduleScore : true, status : true, trainingModuleId : true, enrollmentId : true,
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.moduleReport.count()
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
