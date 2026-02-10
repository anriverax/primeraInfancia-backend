import { PrismaService } from "@/services/prisma/prisma.service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllEventResult } from "../../../dto/attendance.type";
import { GetAllAbsenceClassQuery } from "./get-all-absenceClass.handler";

@QueryHandler(GetAllAbsenceClassQuery)
export class GetAllAbsenceClassHandler implements IQueryHandler<GetAllAbsenceClassQuery> {
  constructor(private readonly prisma: PrismaService) {}
  async execute(): Promise<GetAllEventResult[]> {
    const cls = await this.prisma.absenceClassification.findMany({
      select: {
        id: true,
        name: true
      }
    });

    return cls.sort((a, b) => a.name.localeCompare(b.name));
  }
}
