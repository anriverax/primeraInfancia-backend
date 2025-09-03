import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdInstrumentQuery, GetByDetailInstrumentQuery } from "./getByIdInstrument.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdInstrument, IGetByIdInstrumentDetail } from "@/core/instrument/dto/instrument.type";

@QueryHandler(GetByIdInstrumentQuery)
export class GetByIdInstrumentHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdInstrumentQuery): Promise<IGetByIdInstrument | null> {
    const instruments = await this.prisma.instrument.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        title: true,
        subTitle: true,
        description: true
      }
    });

    return instruments;
  }
}

@QueryHandler(GetByDetailInstrumentQuery)
export class GetByIdDetailInstrumentHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByDetailInstrumentQuery): Promise<IGetByIdInstrumentDetail | null> {
    const instruments = await this.prisma.instrument.findUnique({
      where: { id: query.id },
      include: {
        sections: {
          include: {
            questions: {
              include: {
                options: {
                  include: {
                    DetailOption: true
                  }
                }
              }
            }
          }
        }
      }
    });

    return instruments;
  }
}
