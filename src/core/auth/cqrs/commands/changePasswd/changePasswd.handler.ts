import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { ChangePasswdCommand } from "./changePasswd.command";
import { FindUniqueUserQuery } from "../../queries/user/findUniqueUser.query";
import { AuthService } from "@/core/auth/services/auth.service";
import { UserProjection } from "../../projections/user.projection";
import { PasswdChangedEvent } from "../../events/passwdChanged/passwdChanged.event";
import { EventBusWithStore } from "@/services/events/eventBusWithStore";
import { NestResponse } from "@/common/helpers/dto";

@CommandHandler(ChangePasswdCommand)
export class ChangePasswdHandler implements ICommandHandler<ChangePasswdCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly authService: AuthService,
    private readonly projection: UserProjection,
    private eventBus: EventBusWithStore
  ) {}
  async execute(
    command: ChangePasswdCommand
  ): Promise<NestResponse<{ isVerified: boolean; avatar: string | null }>> {
    const { data } = command;

    const isExist = await this.queryBus.execute(
      new FindUniqueUserQuery({ id: data.id, email: data.email })
    );

    if (!isExist) throw new Error("El usuario no existe en el sistema.");

    const { id, email, isVerified, avatar } = isExist;

    await this.authService.verifyPasswd(isExist.passwd, data.oldPasswd);

    const hashedPassword = await this.authService.hashPassword(data.newPasswd);

    await this.projection.updatePasswdIsVerified({
      id,
      email,
      data: { passwd: hashedPassword }
    });

    this.eventBus.publish(new PasswdChangedEvent(data.email), {
      payload: { dui: data.id, email: data.email, passwd: "passwd-changed" }
    });

    return {
      statusCode: 201,
      message: "¡Tu perfil está listo!",
      data: {
        isVerified,
        avatar
      }
    };
  }
}
