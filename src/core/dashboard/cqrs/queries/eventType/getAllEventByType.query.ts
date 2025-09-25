import { IEventType } from "@/core/dashboard/dto/dashboard.type";
import { Query } from "@nestjs/cqrs";

export class GetAllEventByTypeQuery extends Query<Promise<IEventType[]>> {
  constructor() {
    super();
  }
}
