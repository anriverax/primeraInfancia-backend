import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdInscriptionQuery } from "./getByIdInscription.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdInscription } from "@/core/inscription/dto/inscription.type";

@QueryHandler(GetByIdInscriptionQuery)
export class GetByIdInscriptionHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdInscriptionQuery): Promise<IGetByIdInscription | null> {
    const Inscriptions = await this.prisma.inscription.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        teacherId: true,
        groupId: true,
      }
    });

    return Inscriptions;
  }
}
