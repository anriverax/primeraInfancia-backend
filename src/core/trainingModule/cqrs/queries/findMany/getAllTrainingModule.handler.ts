import { QueryHandler } from "@nestjs/cqrs";
import { GetAllTrainingModuleQuery } from "./getAllTrainingModule.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { ITrainingModulesWithPagination } from "@/core/trainingModule/dto/trainingModule.type";

@QueryHandler(GetAllTrainingModuleQuery)
export class GetAllTrainingModuleHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllTrainingModuleQuery): Promise<ITrainingModulesWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.trainingModule.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          moduleName: true
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.trainingModule.count()
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
