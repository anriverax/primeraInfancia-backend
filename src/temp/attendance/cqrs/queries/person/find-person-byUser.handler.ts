import { QueryHandler } from "@nestjs/cqrs";
import { FindPersonByUserQuery } from "./find-person-byUser.query";
import { PrismaService } from "@/services/prisma/prisma.service";

@QueryHandler(FindPersonByUserQuery)
export class FindPersonByUserHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: FindPersonByUserQuery): Promise<{ id: number } | null> {
    const { userId } = query;

    const person = await this.prisma.person.findFirst({
      where: {
        User: {
          id: userId
        }
      },
      select: {
        id: true
      }
    });

    return person;
  }
}
