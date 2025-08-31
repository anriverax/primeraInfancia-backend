import { IGetByIdSection } from "@/core/section/dto/section.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdSectionQuery extends Query<IGetByIdSection> {
  constructor(public readonly id: number) {
    super();
  }
}
