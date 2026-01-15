import { QueryHandler } from "@nestjs/cqrs";
import { GetAllPersonQuery } from "./getAllPerson.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IPersonsWithPagination } from "@/core/person/dto/person.type";

@QueryHandler(GetAllPersonQuery)
export class GetAllPersonHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllPersonQuery): Promise<IPersonsWithPagination> {
    const { page = 1, limit = 10 } = query.data;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.person.findMany({
        skip,
        take: limit,
        select: {
          id : true,
          firstName : true, lastName1 : true, lastName2 : true, dui : true, address : true, gender : true, phoneNumber : true, birthDate : true, career : true, nip : true, typePersonId : true, districtId : true, cohortId : true,
        },
        orderBy: {
          id: "asc"
        }
      }),

      this.prisma.person.count()
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
