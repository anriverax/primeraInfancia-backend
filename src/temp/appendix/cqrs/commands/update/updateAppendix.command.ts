import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { IUpdateAppendix } from "../../../dto/appendix.type";

export class UpdateAppendixCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateAppendix) {
    super();
  }
}
