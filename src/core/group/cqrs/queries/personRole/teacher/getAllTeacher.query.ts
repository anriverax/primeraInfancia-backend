import { ITeacher } from "@/core/group/dto/group.type";
import { Query } from "@nestjs/cqrs";

export class GetAllTeacherQuery extends Query<ITeacher[]> {
  constructor(public readonly departmentId: number) {
    super();
  }
}
