import { Command } from "@nestjs/cqrs";
import { IAuth } from "@/core/auth/dto/auth.type";

export class RegisterUserCommand extends Command<void> {
  constructor(public readonly data: IAuth) {
    super();
  }
}
