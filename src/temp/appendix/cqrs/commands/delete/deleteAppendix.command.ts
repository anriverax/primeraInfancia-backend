import { NestResponse } from "@/common/helpers/types";
import { IDeleteAppendix } from "@/temp/appendix/dto/appendix.type";
import { Command } from "@nestjs/cqrs";

export class DeleteAppendixCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteAppendix) {
    super();
  }
}
