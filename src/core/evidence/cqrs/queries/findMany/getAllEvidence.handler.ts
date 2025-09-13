import { QueryHandler } from "@nestjs/cqrs";
import { GetAllEvidenceQuery } from "./getAllEvidence.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IEvidencesWithPagination } from "@/core/evidence/dto/evidence.type";

@QueryHandler(GetAllEvidenceQuery)
export class GetAllEvidenceHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllEvidenceQuery): Promise<IEvidencesWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.evidence.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          Evidence: true,
          trackingId: true
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.evidence.count()
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
