import { Command } from "@nestjs/cqrs";

import { NestResponse } from "@/common/helpers/types";

export class AddMenuPermissionCommand extends Command<NestResponse<void>> {
  constructor() {
    super();
  }
}
