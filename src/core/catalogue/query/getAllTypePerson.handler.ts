import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllTypePersonQuery } from "./getAllTypePerson.query";
import { ITypePerson } from "../dto/catalogue.type";

@QueryHandler(GetAllTypePersonQuery)
export class GetAllTypePersonHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<ITypePerson[]> {
    const typePersons = await this.prisma.typePerson.findMany({
      orderBy: {
        name: "asc"
      }
    });

    return typePersons;
  }
}
