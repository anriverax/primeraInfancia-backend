import { Query } from "@nestjs/cqrs";
import { IGetAllEvent } from "../../../dto/event.dto";

export class GetAllEventQuery extends Query<IGetAllEvent[]> {
  constructor(public readonly responsableId: number) {
    super();
  }
}
