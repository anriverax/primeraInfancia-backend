import { NestResponse } from "@/common/helpers/types";
import { IDeleteAppendixTest } from "@/core/appendixTest/dto/appendixTest.type";
import { Command } from "@nestjs/cqrs";

export class DeleteAppendixTestCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteAppendixTest) {
    super();
  }
}
