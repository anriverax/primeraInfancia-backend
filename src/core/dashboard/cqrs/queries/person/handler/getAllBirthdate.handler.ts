import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllBirthdateQuery } from "../queries/getAllBirthdate.query";

@QueryHandler(GetAllBirthdateQuery)
export class GetAllBirthdateHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<{ birthdate: Date | null }[]> {
    const persons = await this.prisma.person.findMany({
      where: {
        typePersonId: 2
      },
      select: {
        birthdate: true
      }
    });

    if (persons.length > 0) {
      const personList = persons.map((person) => ({ birthdate: person.birthdate }));
      return personList;
    }

    return [];
  }
}
