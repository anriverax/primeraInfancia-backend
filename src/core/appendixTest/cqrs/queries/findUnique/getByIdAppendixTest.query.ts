import { IGetByIdAppendixTest } from "@/core/appendixTest/dto/appendixTest.type";
import { Query } from "@nestjs/cqrs";

export class GetByIdAppendixTestQuery extends Query<IGetByIdAppendixTest> {
  constructor(public readonly id: number) {
    super();
  }
}
