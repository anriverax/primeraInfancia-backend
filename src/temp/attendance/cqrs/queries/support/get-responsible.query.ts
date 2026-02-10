import { GetAllSupportResult } from "@/temp/attendance/dto/attendance.type";
import { Query } from "@nestjs/cqrs";

export class GetResposibleQuery extends Query<GetAllSupportResult[]> {
  constructor(public readonly userId: number) {
    super();
  }
}
