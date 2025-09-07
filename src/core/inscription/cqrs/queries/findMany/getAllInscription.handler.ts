import { QueryHandler } from "@nestjs/cqrs";
import { GetAllInscriptionQuery } from "./getAllInscription.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IInscriptionsWithPagination } from "@/core/inscription/dto/inscription.type";

@QueryHandler(GetAllInscriptionQuery)
export class GetAllInscriptionHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllInscriptionQuery): Promise<IInscriptionsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.inscription.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          teacherId: true,
          groupId: true,
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
          },
          Group: {
            select: {
              name: true
            }
          }
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.inscription.count()
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
