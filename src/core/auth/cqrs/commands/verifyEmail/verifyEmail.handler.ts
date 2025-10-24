import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthService } from "@/core/auth/services/auth.service";
import { VerifyEmailCommand } from "./verifyEmail.command";
import { NestResponse } from "@/common/helpers/types";

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(private readonly authService: AuthService) {}
  async execute(command: VerifyEmailCommand): Promise<NestResponse<boolean>> {
    const {
      data: { verifyCode }
    } = command;

    const result = await this.authService.verifyEmailCode(verifyCode);

    if (!result) throw new Error("El código de verificación es incorrecto o ha expirado.");

    // ...existing code...
    // Temporarily disabled: update the read-model to mark the user as verified.
    // If you want to enable it, call:
    // await this.userProjection.updatePasswdIsVerified({ id, email, data: { isVerified: true } });

    return {
      statusCode: 201,
      message: "¡Correo electrónico verificado exitosamente!"
    };
  }
}
