import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllTrainingModulesQuery } from "../queries/getAll-trainingModule.query";
import { Inject } from "@nestjs/common";
import { ITrainingModuleRepository } from "@/core/trainingModule/domain/trainingModule.respository.port";

@QueryHandler(GetAllTrainingModulesQuery)
export class GetAllTrainingModulesHandler implements IQueryHandler<GetAllTrainingModulesQuery> {
  constructor(
    @Inject("ITrainingModuleRepository")
    private readonly trainingModuleRepository: ITrainingModuleRepository
  ) {}

  async execute(): Promise<{ id: number; name: string }[] | []> {
    const trainingModules = await this.trainingModuleRepository.findMany<{ id: number; name: string }>({
      where: {
        cohortId: process.env.DEFAULT_COHORT_ID ? Number(process.env.DEFAULT_COHORT_ID) : 1
      },
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: "asc"
      }
    });

    return trainingModules;
  }
}
