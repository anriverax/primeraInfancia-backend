import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdPersonRoleQuery } from "./getByIdPersonRole.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdPersonRole } from "@/core/personRole/dto/personRole.type";

@QueryHandler(GetByIdPersonRoleQuery)
export class GetByIdPersonRoleHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdPersonRoleQuery): Promise<IGetByIdPersonRole | null> {
    const personRoles = await this.prisma.personRole.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        typePersonId: true,
        personId: true
      }
    });

    return personRoles;
  }
}
