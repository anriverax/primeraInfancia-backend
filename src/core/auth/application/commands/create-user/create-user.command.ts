import { Command } from "@nestjs/cqrs";
import { IAuth } from "@/core/auth/application/dto/auth.type";

export class CreateUserCommand extends Command<void> {
  constructor(public readonly data: IAuth) {
    super();
  }
}
