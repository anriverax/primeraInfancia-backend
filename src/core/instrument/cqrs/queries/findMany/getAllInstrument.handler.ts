import { QueryHandler } from "@nestjs/cqrs";
import { GetAllInstrumentQuery } from "./getAllInstrument.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IInstrumentsWithPagination } from "@/core/instrument/dto/instrument.type";

@QueryHandler(GetAllInstrumentQuery)
export class GetAllInstrumentHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllInstrumentQuery): Promise<IInstrumentsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.instrument.findMany({
        skip,
        take: limit,
        select: {
          id : true,
          title : true, subTitle : true, description : true,
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.instrument.count()
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
