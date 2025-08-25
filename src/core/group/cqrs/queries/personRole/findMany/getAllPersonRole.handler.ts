import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllPersonRoleQuery } from "./getAllPersonRole.query";

@QueryHandler(GetAllPersonRoleQuery)
export class GetAllPersonRoleHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<any> {
    const data = await this.prisma.personRole.findMany({
      where: { typePersonId: 4, Person: { deletedAt: null } },
      select: {
        id: true,
        Person: {
          select: {
            id: true,
            WorkAssignment: {
              select: {
                Municipality: {
                  select: { id: true, name: true, Department: { select: { id: true, name: true } } }
                }
              }
            }
          }
        }
      }
    });

    let deptCounters = 0;

    const groupedData = data.map((item) => {
      const municipalities = item.Person.WorkAssignment.map((wa) => {
        deptCounters += 1;
        return `Grupo ${deptCounters} - CFD ${wa.Municipality.name}`;
      });

      console.log(municipalities);
      return {
        id: item.id,
        personId: item.Person.id
      };
    });

    return {
      data: groupedData
    };
  }
}
