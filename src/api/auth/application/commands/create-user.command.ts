import { Command } from "@nestjs/cqrs";
import { IPersonCreateData } from "../dto/auth.type";

export class CreateUserCommand extends Command<void> {
  constructor(public readonly data: IPersonCreateData) {
    super();
  }
}
