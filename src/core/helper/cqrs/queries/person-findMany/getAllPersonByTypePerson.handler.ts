import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllPersonByTypePersonQuery } from "./getAllPersonByTypePerson.query";
import { IPerson } from "@/core/helper/dto/helper.type";

@QueryHandler(GetAllPersonByTypePersonQuery)
export class GetAllPersonByTypePersonHandler {
  constructor(private readonly prisma: PrismaService) {}

  /* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(query: GetAllPersonByTypePersonQuery): Promise<IPerson[]> {
    const { typePersonId, zoneId } = query;

    const map: Record<number, object> = {
      2: { Inscription: { none: {} } },
      4: { GroupLeader: { none: {} } },
      5: { MentorRegistration: { none: {} } }
    };

    const selectMap: Record<number, object> = {
      2: {
        id: true,
        fullName: true,
        phoneNumber: true,
        User: { select: { email: true } },
        District: {
          select: {
            Municipality: {
              select: {
                Department: {
                  select: {
                    name: true,
                    Zone: { select: { name: true } }
                  }
                }
              }
            }
          }
        }
      },
      4: { id: true, fullName: true },
      5: { id: true, fullName: true }
    };

    const persons = await this.prisma.personRole.findMany({
      where: {
        typePersonId,
        ...map[typePersonId],
        Person: {
          deletedAt: null,
          deletedBy: null,
          District: {
            Municipality: {
              Department: {
                zoneId
              }
            }
          }
        }
      },
      select: {
        id: true,
        Person: {
          select: {
            ...selectMap[typePersonId]
          }
        }
      },
      orderBy: { Person: { firstName: "asc" } }
    });

    return persons as any[];
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
