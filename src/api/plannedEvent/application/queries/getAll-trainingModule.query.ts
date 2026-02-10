import { Query } from "@nestjs/cqrs";

export class GetAllTrainingModulesQuery extends Query<{ id: number; name: string }[] | []> {
  constructor() {
    super();
  }
}
