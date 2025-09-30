import { ITeachersAssignmentMentor } from "@/core/attendance/dto/attendance.type";
import { Query } from "@nestjs/cqrs";

export class FindByUserIdQuery extends Query<ITeachersAssignmentMentor[]> {
  constructor(public readonly id: number) {
    super();
  }
}
