import { IAppendixAnswerCount } from "@/core/dashboard/dto/dashboard.type";
import { Query } from "@nestjs/cqrs";

export class GetAppendixCountQuery extends Query<Promise<IAppendixAnswerCount>> {
  constructor() {
    super();
  }
}
