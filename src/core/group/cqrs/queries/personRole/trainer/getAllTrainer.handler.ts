import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllTrainerQuery } from "./getAllTrainer.query";
import { ITrainer } from "@/core/group/dto/group.type";

@QueryHandler(GetAllTrainerQuery)
export class GetAllTrainerHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<ITrainer[]> {
    const data = await this.prisma.personRole.findMany({
      where: { typePersonId: 4, Person: { deletedAt: null } },
      select: {
        id: true,
        Person: {
          select: {
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
      deptCounters += 1;
      const municipalitiesNames = item.Person.WorkAssignment.map((wa) => {
        const region = wa.Municipality.name.split(" ");
        return region.at(-1);
      });

      const unitedMunicipalities = municipalitiesNames.join("-");
      const deptName = item.Person.WorkAssignment[0]?.Municipality.Department.name;
      const deptId = item.Person.WorkAssignment[0]?.Municipality.Department.id;
      const groups = `Grupo ${deptCounters} - CFDC ${deptName} ${unitedMunicipalities}`;

      return {
        departmentId: deptId,
        GroupLeader: {
          create: {
            trainerId: item.id
          }
        },
        name: groups
      };
    });

    return groupedData;
  }
}
