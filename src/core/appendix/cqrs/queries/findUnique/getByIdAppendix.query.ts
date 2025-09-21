import { IGetByIdAppendix, IGetByIdAppendixDetail } from "@/core/appendix/dto/appendix.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdAppendixQuery extends Query<IGetByIdAppendix> {
  constructor(public readonly id: number) {
    super();
  }
}

export class GetByDetailAppendixQuery extends Query<IGetByIdAppendixDetail> {
  constructor(public readonly id: number) {
    super();
  }
}