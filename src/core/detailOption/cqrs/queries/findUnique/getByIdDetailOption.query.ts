import { IGetByIdDetailOption } from "@/core/detailOption/dto/detailOption.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdDetailOptionQuery extends Query<IGetByIdDetailOption> {
  constructor(public readonly id: number) {
    super();
  }
}
