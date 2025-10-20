import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";

export class GetAllGradesPaginationQuery {
    constructor(public readonly data: { page?: number; limit?: number }) {}
}

@QueryHandler(GetAllGradesPaginationQuery)
export class GetAllGradesPaginationHandler implements IQueryHandler<GetAllGradesPaginationQuery> {
    constructor(private readonly prisma: PrismaService) {}

    async execute(query: GetAllGradesPaginationQuery) {
        const { page = 1, limit = 10 } = query.data;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.grade.findMany({
                skip,
                take: limit,
                include: {
                    evaluationInstrument: true,
                    evaluationInstrumentDetail: true
                },
                orderBy: { id: "asc" }
            }),
            this.prisma.grade.count()
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
