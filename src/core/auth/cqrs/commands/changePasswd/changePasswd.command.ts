import { Command } from "@nestjs/cqrs";
import { NestResponse } from "@/common/helpers/dto";
import { IChangePasswd } from "@/core/auth/dto/auth.type";

export class ChangePasswdCommand extends Command<
  NestResponse<{ isVerified: boolean; avatar: string | null }>
> {
  constructor(public readonly data: IChangePasswd) {
    super();
  }
}
