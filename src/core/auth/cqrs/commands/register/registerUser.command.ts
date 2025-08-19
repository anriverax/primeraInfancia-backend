import { Command } from "@nestjs/cqrs";
import { NestResponse } from "@/common/helpers/types";
import { IAuth } from "@/core/auth/dto/auth.type";

// The command just receives the request and calls the corresponding handler
export class RegisterUserCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IAuth) {
    super();
  }
}
