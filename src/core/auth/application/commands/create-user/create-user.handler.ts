import { ConflictException } from "@nestjs/common";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { CreateUserCommand } from "./create-user.command";
import { UserProjection } from "../../projections/user.projection";
import { FindUserByIdQuery } from "../../queries/find-user/find-user-by-id.query";
import { AuthDomainService } from "../../services/authDomain.service";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authDomain: AuthDomainService,
    private readonly userProjection: UserProjection
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const { data } = command;

    const isExist = await this.queryBus.execute(new FindUserByIdQuery({ email: data.email }));

    if (isExist?.email === data.email || isExist?.Person?.dui === data.dui)
      throw new ConflictException("Este usuario ya se encuentra registrado en el sistema.");

    const dataPrepared = await this.authDomain.prepareUserRegistrationData(data.passwd);
    const { hashedPassword, publicKey, encryptedPrivateKey } = dataPrepared;

    await this.userProjection.register({
      ...data,
      publicKey,
      privateKey: encryptedPrivateKey,
      passwd: hashedPassword,
      isVerified: false
    });

    // await this.authService.createCodeVerificationEmail(data.email);
  }
}
