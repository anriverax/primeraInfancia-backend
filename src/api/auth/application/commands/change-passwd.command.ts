import { Command } from "@nestjs/cqrs";
import { ChangePasswdDto } from "@/api/auth/application/dto/auth.dto";

/**
 * Command puro - Sin dependencia de Express
 * El Guard (AuthenticatedRequestGuard) valida el request antes
 */
export class ChangePasswdCommand extends Command<boolean> {
  constructor(
    public readonly userId: number,
    public readonly email: string,
    public readonly data: ChangePasswdDto
  ) {
    super();
  }
}
