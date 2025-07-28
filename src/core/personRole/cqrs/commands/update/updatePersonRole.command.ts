import { NestResponse } from "@/common/helpers/dto";
import { Command } from "@nestjs/cqrs";
import { IUpdatePersonRole } from "../../../dto/personRole.type";

export class UpdatePersonRoleCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IUpdatePersonRole) {
    super();
  }
}
