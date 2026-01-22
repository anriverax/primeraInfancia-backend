import { Module } from "@nestjs/common";
import { CqrsModule, EventBus } from "@nestjs/cqrs";
import { AuthController } from "./auth.controller";
import { RegisterUserHandler } from "./cqrs/commands/register/register-user.handler";
import { UserProjection } from "./cqrs/projections/user.projection";
import { UserKeyProjection } from "./cqrs/projections/userkey.projection";
import { EventBusWithStore } from "@/services/events/eventBusWithStore";
import { EventStoreService } from "@/services/events/eventStore.service";
import { JwtModule } from "@nestjs/jwt";

// CQRS Handlers
import { ChangePasswdHandler } from "./cqrs/commands/changePasswd/change-passwd.handler";
import { FindUniqueUserQueryHandler } from "./cqrs/queries/user/find-unique-user.query";
import { GetAllUserKeyByUserIdHandler } from "./cqrs/queries/userKey/findMany/get-all-userKey-by-userId.handler";
import { GetByUserIdUserKeyHandler } from "./cqrs/queries/userKey/findFirst/get-by-userId-userKey.handler";
import { GetByRolIdHandler } from "./cqrs/queries/role/get-by-rol-id.handler";
import { GetAllPermissionHandler } from "./cqrs/queries/menuPermission/get-all-permission.handler";
import { LoginHandler } from "./cqrs/commands/login/login.handler";
import { AuthenticationDomainService } from "./services/authDomain.service";

const CommandHandlers = [RegisterUserHandler, ChangePasswdHandler, LoginHandler];

const QueryHandlers = [
  FindUniqueUserQueryHandler,
  GetAllUserKeyByUserIdHandler,
  GetByUserIdUserKeyHandler,
  GetByRolIdHandler,
  GetAllPermissionHandler
];

/* eslint-disable @typescript-eslint/explicit-function-return-type */
@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [AuthController],
  providers: [
    AuthenticationDomainService,
    UserProjection,
    UserKeyProjection,
    EventStoreService,
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: EventBusWithStore,
      useFactory: (eventBus: EventBus, eventStore: EventStoreService) =>
        new EventBusWithStore(eventBus, eventStore),
      inject: [EventBus, EventStoreService]
    }
  ]
})
export class AuthModule {}
