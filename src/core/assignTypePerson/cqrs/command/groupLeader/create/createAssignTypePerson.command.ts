import { NestResponse } from "@/common/helpers/types";
import { ICreateAssignTypePerson } from "@/core/assignTypePerson/dto/assignTypePerson.type";

import { Command } from "@nestjs/cqrs";
import { GroupLeader } from "@prisma/client";

export class CreateAssignTypePersonCommand extends Command<NestResponse<GroupLeader>> {
  constructor(public readonly data: ICreateAssignTypePerson) {
    super();
  }
}
