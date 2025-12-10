import { PrismaService } from "@/services/prisma/prisma.service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

export class FindFirstTrainingModulesQuery {}

@QueryHandler(FindFirstTrainingModulesQuery)
export class FindFirstTrainingModulesHandler implements IQueryHandler<FindFirstTrainingModulesQuery> {
  constructor(private readonly prisma: PrismaService) {}
  async execute(): Promise<{ id: number } | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const trainingModules = await this.prisma.trainingModule.findFirst({
      where: {
        startDate: {
          gte: today
        }
      },
      select: {
        id: true
      }
    });

    return trainingModules;
  }
}
