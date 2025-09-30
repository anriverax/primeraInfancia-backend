import { IGetAllEvent } from "@/core/attendance/dto/attendance.type";
import { Query } from "@nestjs/cqrs";

export class GetAllEventQuery extends Query<IGetAllEvent[]> {
  constructor(public readonly responsableId: number) {
    super();
  }
}
