import { QueryHandler } from "@nestjs/cqrs";
import { GetByIdTrainingModuleQuery } from "./getByIdTrainingModule.query";
import { PrismaService } from "@/services/prisma/prisma.service";
import { IGetByIdTrainingModule } from "@/core/trainingModule/dto/trainingModule.type";

@QueryHandler(GetByIdTrainingModuleQuery)
export class GetByIdTrainingModuleHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetByIdTrainingModuleQuery): Promise<IGetByIdTrainingModule | null> {
    const trainingModules = await this.prisma.trainingModule.findUnique({
      where: { id: query.id },
      select: {
        id: true,
        name: true,
        title: true,
        startDate: true,
        endDate: true,
        hours: true,
        Cohort: {
          select: { name: true, id: true }
        }
      }
    });

    return trainingModules;
  }
}
