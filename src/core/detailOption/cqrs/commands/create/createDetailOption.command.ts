import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { ICreateDetailOption } from "../../../dto/detailOption.type";
import { DetailOption } from "@prisma/client";

export class CreateDetailOptionCommand extends Command<NestResponse<DetailOption>> {
  constructor(public readonly data: ICreateDetailOption) {
    super();
  }
}
