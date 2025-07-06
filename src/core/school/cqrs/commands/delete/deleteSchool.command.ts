import { NestResponse } from "@/common/helpers/dto";
import { IDeleteSchool } from "@/core/school/dto/school.type";
import { Command } from "@nestjs/cqrs";

export class DeleteSchoolCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeleteSchool) {
    super();
  }
}
