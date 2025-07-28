import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdGroupTrainerQuery } from "./getByIdGroupTrainer.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdGroupTrainer } from "@/core/groupTrainer/dto/groupTrainer.type";

@QueryHandler(GetByIdGroupTrainerQuery)
export class GetByIdGroupTrainerHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdGroupTrainerQuery): Promise<IGetByIdGroupTrainer | null> {
    const groupTrainers = await this.prisma.groupTrainer.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        groupId: true,
        trainerId: true
      }
    });

    return groupTrainers;
  }
}
