import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdPersonQuery } from "./getByIdPerson.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetPerson } from "@/core/person/dto/person.type";

@QueryHandler(GetByIdPersonQuery)
export class GetByIdPersonHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdPersonQuery): Promise<IGetPerson | null> {
    const persons = await this.prisma.person.findUnique({
      where: { id: query.id },
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
      }
    });

    return persons;
  }
}
