import { NestResponse } from "@/common/helpers/dto";
import { IDeletePersonRole } from "@/core/personRole/dto/personRole.type";
import { Command } from "@nestjs/cqrs";

export class DeletePersonRoleCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IDeletePersonRole) {
    super();
  }
}
