import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { IUpdateSchool } from "../../../dto/school.type";

export class UpdateSchoolCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdateSchool) {
    super();
  }
}
