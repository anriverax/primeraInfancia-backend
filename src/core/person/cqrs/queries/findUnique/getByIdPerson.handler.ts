import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdPersonQuery } from "./getByIdPerson.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdPerson } from "@/core/person/dto/person.type";

@QueryHandler(GetByIdPersonQuery)
export class GetByIdPersonHandler {
  constructor(private readonly prisma: PrismaService) {}
/* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(query: GetByIdPersonQuery): Promise<IGetByIdPerson | null> {
    const persons = await this.prisma.person.findUnique({
      where: { id: query.id },
      select: {
        id : true,
        firstName : true, lastName1 : true, lastName2 : true, dui : true, address : true, gender : true, phoneNumber : true, birthDate : true, career : true, nip : true, typePersonId : true, districtId : true, cohortId : true,
      }
    });

    return persons;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
