import { Query } from "@nestjs/cqrs";
import { IGetAllTrainingModule } from "@/core/catalogue/trainingModule/dto/trainingModule.type";

export class GetAllTrainingModuleQuery extends Query<IGetAllTrainingModule[]> {
  constructor() {
    super();
  }
}
