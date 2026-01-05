import { QueryHandler } from "@nestjs/cqrs";
import { GetPersonRoleByUserQuery } from "./getPersonRoleByUser.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { Person } from "prisma/generated/client";

@QueryHandler(GetPersonRoleByUserQuery)
export class GetPersonRoleByUserHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetPersonRoleByUserQuery): Promise<Person | null> {
    const { userId } = query;

    const personRole = await this.prisma.person.findFirst({
      where: {
        User: {
          id: userId
        }
      }
    });

    return personRole;
  }
}
