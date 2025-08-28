import { IMentor } from "@/core/group/dto/group.type";
import { Query } from "@nestjs/cqrs";

export class GetAllMentorQuery extends Query<IMentor[]> {
  constructor(public readonly departmentId: number) {
    super();
  }
}
