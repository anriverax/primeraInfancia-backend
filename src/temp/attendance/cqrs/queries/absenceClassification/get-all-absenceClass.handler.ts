import { GetAllEventResult } from "@/temp/attendance/dto/attendance.type";
import { Query } from "@nestjs/cqrs";

export class GetAllAbsenceClassQuery extends Query<GetAllEventResult[]> {
  constructor() {
    super();
  }
}
