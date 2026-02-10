import { Query } from "@nestjs/cqrs";
import { IPlannedEvent } from "../dto/plannedEvent.type";

export class FindUniquePlannedEventByIdQuery extends Query<IPlannedEvent | null> {
  constructor(
    public readonly id: number,
    public readonly withTeacher: boolean
  ) {
    super();
  }
}
