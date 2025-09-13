import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { ICreateOption } from "../../../dto/option.type";
import { Option } from "@prisma/client";

export class CreateOptionCommand extends Command<NestResponse<Option>> {
  constructor(public readonly data: ICreateOption) {
    super();
  }
}
