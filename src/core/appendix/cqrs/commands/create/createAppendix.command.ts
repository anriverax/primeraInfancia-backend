import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { ICreateAppendix } from "../../../dto/appendix.type";
import { Appendix } from "@prisma/client";

export class CreateAppendixCommand extends Command<NestResponse<Appendix>> {
  constructor(public readonly data: ICreateAppendix) {
    super();
  }
}
