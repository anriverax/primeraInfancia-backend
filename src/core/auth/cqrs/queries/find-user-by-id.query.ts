import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IUser } from "@/core/auth/dto/auth.type";
import { FindUserByIdQuery } from "./find-user-by-id.handler";

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdQueryHandler implements IQueryHandler<FindUserByIdQuery> {
  constructor(private readonly prisma: PrismaService) {}

  /* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(query: FindUserByIdQuery): Promise<IUser | null> {
    const where: any = {};
    const { email, id } = query;

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
