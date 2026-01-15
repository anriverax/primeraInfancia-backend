import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { IUpdatePerson } from "../../../dto/person.type";

export class UpdatePersonCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdatePerson) {
    super();
  }
}
