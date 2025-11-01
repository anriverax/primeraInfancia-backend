import { IDashboardResume } from "@/core/dashboard/dto/dashboard.type";
import { Query } from "@nestjs/cqrs";

export class GetAppendixResumeQuery extends Query<Promise<IDashboardResume>> {
  constructor() {
    super();
  }
}
