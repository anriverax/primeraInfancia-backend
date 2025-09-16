import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdEvidenceQuery } from "./getByIdEvidence.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdEvidence } from "@/core/evidence/dto/evidence.type";

@QueryHandler(GetByIdEvidenceQuery)
export class GetByIdEvidenceHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdEvidenceQuery): Promise<IGetByIdEvidence | null> {
    const evidences = await this.prisma.evidence.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        Evidence: true,
        trackingId: true
      }
    });

    return evidences;
  }
}
