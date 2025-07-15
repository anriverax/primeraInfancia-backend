import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllPersonQuery } from "./getAllPerson.query";
import { IPerson } from "../../dto/catalogue.type";

@QueryHandler(GetAllPersonQuery)
export class GetAllPersonHandler {
  constructor(private readonly prisma: PrismaService) {}

  /* eslint-disable @typescript-eslint/no-explicit-any */
  async execute(query: GetAllPersonQuery): Promise<IPerson[]> {
    const { typePersonId } = query;
    let selectProps: any;

    if (typePersonId === 2) {
      selectProps = {
        id: true,
        fullName: true,
        phoneNumber: true,
        User: {
          select: {
            email: true
          }
        },
        District: {
          select: {
            Municipality: {
              select: {
                Department: {
                  select: {
                    name: true,
                    Zone: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };
    }

    if (typePersonId === 4) {
      selectProps = {
        id: true,
        fullName: true
      };
    }

    const persons = await this.prisma.person.findMany({
      where: {
        typePersonId
      },
      select: selectProps as any,
      orderBy: {
        firstName: "asc"
      }
    });

    return persons as any[];
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
