import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IFindUserByParams, IUser } from "@/core/auth/dto/auth.type";
import { Query } from "@nestjs/cqrs";

export class FindUniqueUserQuery extends Query<IUser | null> {
  constructor(public readonly params: IFindUserByParams) {
    super();
  }
}

@QueryHandler(FindUniqueUserQuery)
export class FindUniqueUserQueryHandler implements IQueryHandler<FindUniqueUserQuery> {
  constructor(private readonly prisma: PrismaService) {}

  /* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(query: FindUniqueUserQuery): Promise<IUser | null> {
    const where: any = {};

    const {
      params: { email, id }
    } = query;

    if (email) where.email = email;
    if (id) where.id = id;

    const user = await this.prisma.user.findUnique({
      where,
      include: { Role: true, Person: true }
    });

    return user || null;
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
