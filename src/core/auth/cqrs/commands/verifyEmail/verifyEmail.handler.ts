import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthService } from "@/core/auth/services/auth.service";
import { UserProjection } from "../../projections/user.projection";
import { VerifyEmailCommand } from "./verifyEmail.command";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    private readonly authService: AuthService,
    private readonly projection: UserProjection
  ) {}
  async execute(command: VerifyEmailCommand): Promise<NestResponse<boolean>> {
    const {
      data: { verifyCode, email, id }
    } = command;

    const result = await this.authService.verifyEmailCode(verifyCode);

    if (!result) throw new Error("El código de verificación es incorrecto o ha expirado.");

    await this.projection.updatePasswdIsVerified({
      id,
      email,
      data: { isVerified: true }
    });

    return {
      statusCode: 201,
      message: "¡Correo electrónico verificado exitosamente!",
      data: result
    };
  }
}
