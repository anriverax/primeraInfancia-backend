import { IGetByIdOption } from "@/core/option/dto/option.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdOptionQuery extends Query<IGetByIdOption> {
  constructor(public readonly id: number) {
    super();
  }
}
