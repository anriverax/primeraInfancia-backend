import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { ICreateSchool } from "../../../dto/school.type";
import { School } from "@prisma/client";

export class CreateSchoolCommand extends Command<NestResponse<School>> {
  constructor(public readonly data: ICreateSchool) {
    super();
  }
}
