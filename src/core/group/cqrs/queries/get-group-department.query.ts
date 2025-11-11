import { PrismaService } from "@/services/prisma/prisma.service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GroupList } from "../../dto/group.type";

export class GetGroupByDepartmentQuery {
  constructor(public readonly departmentId: number) {}
}

@QueryHandler(GetGroupByDepartmentQuery)
export class GetGroupByDepartmentHandler implements IQueryHandler<GetGroupByDepartmentQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute({ departmentId }: GetGroupByDepartmentQuery): Promise<GroupList[]> {
    return await this.prisma.group.findMany({
      where: {
        departmentId
      },
      select: {
        id: true,
        name: true,
        memberCount: true
      },
      orderBy: {
        name: "asc"
      }
    });
  }
}
