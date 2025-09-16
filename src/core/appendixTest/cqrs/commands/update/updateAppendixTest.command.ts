import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { IUpdateAppendixTest } from "../../../dto/appendixTest.type";

export class UpdateAppendixTestCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateAppendixTest) {
    super();
  }
}
