import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserProjection } from "../../projections/user.projection";
import { PasswdChangedEvent } from "../../events/passwdChanged/passwdChanged.event";
import { EventBusWithStore } from "@/services/events/eventBusWithStore";
import { Command } from "@nestjs/cqrs";
import { NestResponse } from "@/common/helpers/types";
import { IChangePasswd } from "@/core/auth/dto/auth.type";

export class ChangePasswdCommand extends Command<NestResponse<void>> {
  constructor(public readonly data: IChangePasswd) {
    super();
  }
}

@CommandHandler(ChangePasswdCommand)
export class ChangePasswdHandler implements ICommandHandler<ChangePasswdCommand> {
  constructor(
    private readonly userProjection: UserProjection,

    private eventBus: EventBusWithStore
  ) {}
  async execute(command: ChangePasswdCommand): Promise<NestResponse<void>> {
    const { data } = command;

    await this.userProjection.updatePasswdIsVerified({
      id: data.id,
      email: data.oldEmail,
      data: { passwd: data.hashedPassword, isVerified: true, email: data.newEmail }
    });

    this.eventBus.publish(new PasswdChangedEvent(data.newEmail), {
      payload: { dui: data.id, email: data.newEmail, passwd: "passwd-changed" }
    });

    return {
      statusCode: 200,
      message: "¡Tu perfil está listo!"
    };
  }
}
