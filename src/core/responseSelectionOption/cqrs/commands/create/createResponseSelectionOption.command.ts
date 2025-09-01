import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { ICreateResponseSelectionOption } from "../../../dto/responseSelectionOption.type";
import { ResponseSelectionOption } from "@prisma/client";

export class CreateResponseSelectionOptionCommand extends Command<
  NestResponse<ResponseSelectionOption>
> {
  constructor(public readonly data: ICreateResponseSelectionOption) {
    super();
  }
}
