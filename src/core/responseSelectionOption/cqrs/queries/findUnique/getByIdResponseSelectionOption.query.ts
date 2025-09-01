import { IGetByIdResponseSelectionOption } from "@/core/responseSelectionOption/dto/responseSelectionOption.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdResponseSelectionOptionQuery extends Query<IGetByIdResponseSelectionOption> {
  constructor(public readonly id: number) {
    super();
  }
}
