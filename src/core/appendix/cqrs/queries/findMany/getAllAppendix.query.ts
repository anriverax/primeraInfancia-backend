import { IGetAllAppendix } from "@/core/appendix/dto/appendix.type";
import { Query } from "@nestjs/cqrs";

export class GetAllAppendixQuery extends Query<IGetAllAppendix[]> {
  constructor() {
    super();
  }
}
