import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllPersonByTypePersonQuery } from "../queries/getAllPersonByTypePerson.query";

@QueryHandler(GetAllPersonByTypePersonQuery)
export class GetAllPersonByTypePersonHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<number> {
    const persons = await this.prisma.personRole.count({
      where: {
        typePersonId: 2
      }
    });

    return persons;
  }
}
