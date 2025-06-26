import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllPersonQuery } from "./getAllPerson.query";
import { IPerson } from "../../dto/catalogue.type";

@QueryHandler(GetAllPersonQuery)
export class GetAllPersonHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<IPerson[]> {
    const persons = await this.prisma.person.findMany({
      select: { id: true, fullName: true } as any,
      orderBy: {
        id: "asc"
      }
    });

    return persons as any[];
  }
}
