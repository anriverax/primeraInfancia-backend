import { NestResponse } from "@/common/helpers/types";
import { IDeleteAssignTypePerson } from "@/core/assignTypePerson/dto/assignTypePerson.type";
import { Command } from "@nestjs/cqrs";

export class DeleteAssignTypePersonCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteAssignTypePerson) {
    super();
  }
}
