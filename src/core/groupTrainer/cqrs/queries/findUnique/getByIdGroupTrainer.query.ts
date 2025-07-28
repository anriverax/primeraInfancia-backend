import { IGetByIdGroupTrainer } from "@/core/groupTrainer/dto/groupTrainer.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdGroupTrainerQuery extends Query<IGetByIdGroupTrainer> {
  constructor(public readonly id: number) {
    super();
  }
}
