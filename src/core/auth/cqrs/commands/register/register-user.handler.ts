import { ConflictException } from "@nestjs/common";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { AuthService } from "../../../services/auth.service";
import { KeyService } from "../../../services/key.service";
import { UserProjection } from "../../projections/user.projection";
import { RegisterUserCommand } from "./register-user.command";
import { FindUniqueUserQuery } from "../../queries/find-user-by-id.handler";

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authService: AuthService,
    private readonly keyService: KeyService,
    private readonly userProjection: UserProjection
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const { data } = command;

    const isExist = await this.queryBus.execute(new FindUniqueUserQuery({ email: data.email }));

    if (isExist?.email === data.email || isExist?.Person?.dui === data.dui)
      throw new ConflictException("Este usuario ya se encuentra registrado en el sistema.");

    const hashedPassword = await this.authService.hashPassword(data.passwd);

    const { publicKey, privateKey } = this.keyService.generateKeyPair();
    const encryptedPrivateKey = this.keyService.encryptPrivateKey(privateKey);

    await this.userProjection.register({
      ...data,
      publicKey,
      privateKey: encryptedPrivateKey,
      passwd: hashedPassword,
      isVerified: false
    });

    await this.authService.createCodeVerificationEmail(data.email);
  }
}
