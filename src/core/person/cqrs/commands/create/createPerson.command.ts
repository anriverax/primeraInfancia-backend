import { NestResponse } from "@/common/helpers/types";
import { Command } from "@nestjs/cqrs";
import { ICreatePerson } from "../../../dto/person.type";
import { Person } from "@prisma/client";

export class CreatePersonCommand extends Command<NestResponse<Person>> {
  constructor(public readonly data: ICreatePerson) {
    super();
  }
}
