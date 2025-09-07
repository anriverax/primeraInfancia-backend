import { IGetByIdTrainingReport } from "@/core/trainingReport/dto/trainingReport.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdTrainingReportQuery extends Query<IGetByIdTrainingReport> {
  constructor(public readonly id: number) {
    super();
  }
}
