import { ConflictException } from "@nestjs/common";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { AuthService } from "../../../services/auth.service";
import { RegisterUserCommand } from "./registerUser.command";
import { EventBusWithStore } from "@/services/events/eventBusWithStore";
import { KeyService } from "../../../services/key.service";
import { UserProjection } from "../../projections/user.projection";
import { FindUniqueUserQuery } from "../../queries/user/findUniqueUser.query";
import { UserRegisteredEvent } from "../../events/registered/userRegistered.event";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authService: AuthService,
    private eventBus: EventBusWithStore,
    private readonly keyService: KeyService,
    private readonly projection: UserProjection
  ) {}

  async execute(command: RegisterUserCommand): Promise<NestResponse<void>> {
    const { data } = command;

    const isExist = await this.queryBus.execute(new FindUniqueUserQuery({ email: data.email }));

    if (isExist?.email === data.email || isExist?.Person?.dui === data.dui)
      throw new ConflictException("Este usuario ya se encuentra registrado en el sistema.");

    const hashedPassword = await this.authService.hashPassword(data.passwd);

    const { publicKey, privateKey } = this.keyService.generateKeyPair();
    const encryptedPrivateKey = this.keyService.encryptPrivateKey(privateKey);

    await this.projection.register({
      ...data,
      publicKey,
      privateKey: encryptedPrivateKey,
      passwd: hashedPassword,
      isVerified: false
    });

    // Publish the registered user event with the required data
    this.eventBus.publish(
      new UserRegisteredEvent({
        ...data,
        publicKey,
        privateKey: encryptedPrivateKey,
        passwd: data.passwd,
        isVerified: false
      }),
      {
        payload: {
          dui: data.dui,
          email: data.email,
          isVerified: false
        }
      }
    );

    return {
      statusCode: 200,
      message:
        "Registro exitoso. Se ha enviado un correo de verificación a su dirección de correo electrónico. Por favor, revise su bandeja de entrada y siga las instrucciones para completar el proceso."
    };
  }
}
