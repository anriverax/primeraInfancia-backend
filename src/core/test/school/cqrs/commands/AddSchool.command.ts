import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { ISchool } from "../../dto/school.type";

export class AddShoolCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: ISchool) {
    super();
  }
}
