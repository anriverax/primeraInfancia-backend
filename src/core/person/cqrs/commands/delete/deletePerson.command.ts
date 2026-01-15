import { NestResponse } from "@/common/helpers/types";
import { IDeletePerson } from "@/core/person/dto/person.type";
import { Command } from "@nestjs/cqrs";

export class DeletePersonCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeletePerson) {
    super();
  }
}
