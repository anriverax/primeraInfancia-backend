import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllTypePersonQuery } from "./getAllTypePerson.query";
import { TypePerson } from "@prisma/client";

@QueryHandler(GetAllTypePersonQuery)
export class GetAllTypePersonHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<Pick<TypePerson, "id" | "name">[]> {
    const typePersons = await this.prisma.typePerson.findMany({
      orderBy: {
        name: "asc"
      }
    });

    return typePersons;
  }
}
