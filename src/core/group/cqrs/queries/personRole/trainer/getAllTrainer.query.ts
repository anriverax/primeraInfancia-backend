import { ITrainer } from "@/core/group/dto/group.type";
import { Query } from "@nestjs/cqrs";

export class GetAllTrainerQuery extends Query<ITrainer[]> {
  constructor() {
    super();
  }
}
