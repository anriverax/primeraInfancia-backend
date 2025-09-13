import { NestResponse } from "@/common/helpers/types";
import { IDeleteOption } from "@/core/option/dto/option.type";
import { Command } from "@nestjs/cqrs";

export class DeleteOptionCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteOption) {
    super();
  }
}
