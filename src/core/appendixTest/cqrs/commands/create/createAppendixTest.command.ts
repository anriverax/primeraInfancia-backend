import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { ICreateAppendixTest } from "../../../dto/appendixTest.type";
import { AppendixTest } from "@prisma/client";

export class CreateAppendixTestCommand extends Command<NestResponse<AppendixTest>> {
  constructor(public readonly data: ICreateAppendixTest) {
    super();
  }
}
