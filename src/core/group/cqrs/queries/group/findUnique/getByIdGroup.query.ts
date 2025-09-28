import { IGetByIdGroup, IGetByIdGroupGradeDetail } from "@/core/group/dto/group.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdGroupQuery extends Query<IGetByIdGroup> {
  constructor(public readonly id: number) {
    super();
  }
}

export class GetByIdGroupGradeDetailQuery extends Query<IGetByIdGroupGradeDetail> {
  constructor(public readonly id: number) {
    super();
  }
}