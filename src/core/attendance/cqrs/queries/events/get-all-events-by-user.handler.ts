import { GetAllEventResult } from "@/core/attendance/dto/attendance.type";
import { Query } from "@nestjs/cqrs";

export class GetAllEventsByUserQuery extends Query<GetAllEventResult[]> {
  constructor(public readonly responsible: number) {
    super();
  }
}
