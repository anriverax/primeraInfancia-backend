import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdInstrumentQuery } from "./getByIdInstrument.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdInstrument } from "@/core/instrument/dto/instrument.type";

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
