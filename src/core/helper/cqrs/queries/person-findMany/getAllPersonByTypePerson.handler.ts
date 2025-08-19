import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllPersonByTypePersonQuery } from "./getAllPersonByTypePerson.query";
import { IPersonsWithPagination } from "@/core/helper/dto/helper.type";

@QueryHandler(GetAllPersonByTypePersonQuery)
export class GetAllPersonByTypePersonHandler {
  constructor(private readonly prisma: PrismaService) {}

  /* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(query: GetAllPersonByTypePersonQuery): Promise<IPersonsWithPagination> {
    const { typePersonId, zoneId, pagination } = query;
    const { page = 1, limit = 10 } = pagination;
    let newData: any[] = [];

    const districtSelect = {
      select: {
        name: true,
        Municipality: {
          select: {
            name: true,
            Department: {
              select: {
                name: true,
                Zone: { select: { name: true } }
              }
            }
          }
        }
      }
    };

    const skip = (page - 1) * limit;

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
        PrincipalSchool: {
          select: {
            School: {
              select: {
                id: true,
                name: true,
                coordenates: true,
                District: districtSelect
              }
            }
          }
        },
        District: districtSelect
      },
      4: { id: true, fullName: true },
      5: { id: true, fullName: true }
    };

    const [personsData, total] = await Promise.all([
      this.prisma.personRole.findMany({
        skip,
        take: limit,
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
      }),

      this.prisma.personRole.count({
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
        }
      })
    ]);

    const lastPage = Math.ceil(total / limit);

    if (typePersonId === 2) {
      newData = personsData.map((item: any) => {
        const { Person, ...rest } = item;
        const { District, User, PrincipalSchool, ...other } = Person;

        const schools = PrincipalSchool.map((principal: any) => ({
          id: principal.School.id,
          name: principal.School.name,
          coordenates: principal.School.coordenates,
          address: `${principal.School.District?.Municipality?.Department.name} - ${principal.School.District?.Municipality?.name} - ${principal.School.District?.name}`
        }));

        return {
          ...rest,
          fullName: other.fullName,
          phoneNumber: other.phoneNumber,
          address: `${District.Municipality.Department.name} - ${District.Municipality.name} - ${District.name}`,
          User,
          school: schools
        };
      });
    } else newData = personsData;

    return {
      data: newData,
      meta: {
        total,
        currentPage: page,
        perPage: limit,
        lastPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null
      }
    };
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
