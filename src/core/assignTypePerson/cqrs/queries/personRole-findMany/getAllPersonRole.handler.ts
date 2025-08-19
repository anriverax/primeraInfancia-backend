import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllPersonRoleQuery } from "./getAllPersonRole.query";
import { PersonRole } from "@prisma/client";
import { IPersonRole } from "@/core/assignTypePerson/dto/assignTypePerson.type";

@QueryHandler(GetAllPersonRoleQuery)
export class getAllPersonRoleHandler {
  constructor(private readonly prisma: PrismaService) {}

  /* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(query: GetAllPersonRoleQuery): Promise<IPersonRole[]> {
    const { typePersonId, zoneId, memberCount } = query;

    const map: Record<number, object> = {
      2: { Inscription: { none: {} } },
      5: { MentorRegistration: { none: {} } }
    };

    const participants = await this.prisma.personRole.findMany({
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
      orderBy: { Person: { firstName: "asc" } }
    });

    if (participants.length > 0) {
      const selectParticipants = () => {
        return participants.sort(() => Math.random() - 0.5).slice(0, memberCount);
      };

      const selectedResult = selectParticipants().map((item: PersonRole) => ({
        id: item.id
      }));

      return selectedResult;
    }

    return [];
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
