import { IAspectPracticeCount } from "@/core/dashboard/dto/dashboard.type";
import { Query } from "@nestjs/cqrs";

export class GetAspectPracticeCountQuery extends Query<Promise<IAspectPracticeCount>> {
  constructor() {
    super();
  }
}
