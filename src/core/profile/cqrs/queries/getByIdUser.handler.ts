import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { PrismaService } from "@/services/prisma/prisma.service";
import { GetByIdUserQuery } from "./getByIdUser.query";
import { IUploadProfile } from "../../dto/profile.type";

@QueryHandler(GetByIdUserQuery)
export class GetByIdUserHandler implements IQueryHandler<GetByIdUserQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdUserQuery): Promise<IUploadProfile | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: query.id },
      select: { Person: { select: { id: true, dui: true } } }
    });

    return user || null;
  }
}
