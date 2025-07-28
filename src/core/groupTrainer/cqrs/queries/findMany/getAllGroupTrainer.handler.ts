import { QueryHandler } from "@nestjs/cqrs";
import { GetAllGroupTrainerQuery } from "./getAllGroupTrainer.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGroupTrainersWithPagination } from "@/core/groupTrainer/dto/groupTrainer.type";

@QueryHandler(GetAllGroupTrainerQuery)
export class GetAllGroupTrainerHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllGroupTrainerQuery): Promise<IGroupTrainersWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.groupTrainer.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          groupId: true,
          trainerId: true
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.groupTrainer.count()
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
