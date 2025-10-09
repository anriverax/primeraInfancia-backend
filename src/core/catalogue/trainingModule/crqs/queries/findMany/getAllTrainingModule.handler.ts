import { QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "@/services/prisma/prisma.service";
import { GetAllTrainingModuleQuery } from "./getAllTrainingModule.query";
import { IGetAllTrainingModule } from "../../../dto/trainingModule.type";

@QueryHandler(GetAllTrainingModuleQuery)
export class GetAllTrainingModuleHandler {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<IGetAllTrainingModule[]> {
    const trainingModules = await this.prisma.trainingModule.findMany({
      select: {
        id: true,
        name: true,
        title: true,
        startDate: true,
        endDate: true,
        hours: true
      },
      orderBy: {
        name: "asc"
      }
    });

    return trainingModules;
  }
}
