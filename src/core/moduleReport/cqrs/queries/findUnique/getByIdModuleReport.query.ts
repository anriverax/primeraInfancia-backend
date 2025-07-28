import { IGetByIdModuleReport } from "@/core/moduleReport/dto/moduleReport.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdModuleReportQuery extends Query<IGetByIdModuleReport> {
  constructor(public readonly id: number) {
    super();
  }
}
