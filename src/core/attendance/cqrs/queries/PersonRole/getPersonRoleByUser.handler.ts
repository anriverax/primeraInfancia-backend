import { QueryHandler } from "@nestjs/cqrs";
import { GetPersonRoleByUserQuery } from "./getPersonRoleByUser.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { PersonRole } from "@prisma/client";

@QueryHandler(GetPersonRoleByUserQuery)
export class GetPersonRoleByUserHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetPersonRoleByUserQuery): Promise<PersonRole | null> {
    const { userId } = query;

    const personRole = await this.prisma.personRole.findFirst({
      where: {
        Person: {
          User: {
            id: userId
          }
        }
      }
    });

    return personRole;
  }
}
