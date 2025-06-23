import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetByUserIdUserKeyQuery } from "./getByUserIdUserKey.query";
import { UserKey } from "@prisma/client";

@QueryHandler(GetByUserIdUserKeyQuery)
export class GetByUserIdUserKeyHandler implements IQueryHandler<GetByUserIdUserKeyQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByUserIdUserKeyQuery): Promise<UserKey | null> {
    const { userId } = query;

    const userKey = await this.prisma.userKey.findFirst({
      where: { userId, isActive: true }
    });

    return userKey || null;
  }
}
