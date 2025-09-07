import { IGetByIdTrainingModule } from "@/core/trainingModule/dto/trainingModule.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdTrainingModuleQuery extends Query<IGetByIdTrainingModule> {
  constructor(public readonly id: number) {
    super();
  }
}
