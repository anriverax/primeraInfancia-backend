import { Command } from "@nestjs/cqrs";

import { NestResponse } from "@/common/helpers/dto";
import { IRolePermission } from "../../../permission.type";

export class AddRolePermissionCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IRolePermission[]) {
    super();
  }
}
