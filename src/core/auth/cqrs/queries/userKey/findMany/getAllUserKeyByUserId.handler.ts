import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllUserKeyByUserIdQuery } from "./getAllUserKeyByUserId.query";
import { UserKey } from "@prisma/client";

@QueryHandler(GetAllUserKeyByUserIdQuery)
export class GetAllUserKeyByUserIdHandler implements IQueryHandler<GetAllUserKeyByUserIdQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetAllUserKeyByUserIdQuery): Promise<UserKey[] | []> {
    const { userId } = query;

    const userKey = await this.prisma.userKey.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    return userKey || [];
  }
}
