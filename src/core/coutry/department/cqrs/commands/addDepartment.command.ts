import { Command } from "@nestjs/cqrs";

import { NestResponse } from "@/common/helpers/dto";
import { IDepartment } from "../../dto/department.type";

export class AddDepartmentCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDepartment) {
    super();
  }
}
