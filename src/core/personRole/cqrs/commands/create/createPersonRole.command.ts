import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { ICreatePersonRole } from "../../../dto/personRole.type";
import { PersonRole } from "@prisma/client";

export class CreatePersonRoleCommand extends Command<NestResponse<PersonRole>> {
  constructor(public readonly data: ICreatePersonRole) {
    super();
  }
}
