import { QueryHandler } from "@nestjs/cqrs";
import { GetAllPersonQuery } from "./getAllPerson.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetPerson } from "@/core/person/dto/person.type";

@QueryHandler(GetAllPersonQuery)
export class GetAllPersonHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<IGetPerson[]> {
    const persons = await this.prisma.person.findMany({
      select: {
        id: true,
        firstName: true,
        lastName1: true,
        lastName2: true,
        dui: true,
        address: true,
        gender: true,
        phoneNumber: true,
        birthdate: true,
        duiImage: true,
        districtId: true,
        isActive: true,
        typePersonId: true,
        _count: {
          select: {
            Group: true
          }
        }
      },
      orderBy: {
        id: "asc"
      }
    });

    return persons;
  }
}
