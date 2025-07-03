import { Command } from "@nestjs/cqrs";

import { NestResponse } from "@/common/helpers/dto";

export class AddMenuPermissionCommand extends Command<NestResponse<void>> {
  constructor() {
    super();
  }
}
