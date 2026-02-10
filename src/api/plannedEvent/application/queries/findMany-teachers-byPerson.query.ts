import { Query } from "@nestjs/cqrs";
import { ITeacherListWithSchool } from "../dto/plannedEvent.type";

export class FindManyTeachersByPersonQuery extends Query<ITeacherListWithSchool[] | []> {
  constructor(public readonly userId: number) {
    super();
  }
}
