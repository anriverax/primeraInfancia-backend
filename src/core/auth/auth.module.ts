import { Module } from "@nestjs/common";
import { CqrsModule, EventBus } from "@nestjs/cqrs";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { RegisterUserHandler } from "./cqrs/commands/register/registerUser.command";
import { UserRegisteredHandler } from "./cqrs/events/registered/userRegistered.handler";
import { UserProjection } from "./cqrs/projections/user.projection";
import { UserKeyProjection } from "./cqrs/projections/userkey.projection";
import { FindUniqueUserQueryHandler } from "./cqrs/queries/user/findUniqueUser.query";
import { EventBusWithStore } from "@/services/events/eventBusWithStore";
import { EventStoreService } from "@/services/events/eventStore.service";
import { RedisService } from "@/services/redis/redis.service";
import { TokenService } from "./services/token.service";
import { KeyService } from "./services/key.service";
import { JwtModule } from "@nestjs/jwt";
import { ChangePasswdHandler } from "./cqrs/commands/changePasswd/changePasswd.handler";
import { GetAllUserKeyByUserIdHandler } from "./cqrs/queries/userKey/findMany/getAllUserKeyByUserId.handler";
import { GetByUserIdUserKeyHandler } from "./cqrs/queries/userKey/findFirst/getByUserIdUserKey.handler";
import { PasswdChangedHandler } from "./cqrs/events/passwdChanged/passwdChanged.handler";
import { VerifyEmailHandler } from "./cqrs/commands/verifyEmail/verifyEmail.handler";
import { GetByRolIdHandler } from "./cqrs/queries/role/getByRolId.handler";
import { GetAllPermissionHandler } from "./cqrs/queries/menuPermission/getAllPermission.handler";

const CommandHandlers = [RegisterUserHandler, VerifyEmailHandler, ChangePasswdHandler];

const QueryHandlers = [
  FindUniqueUserQueryHandler,
  GetAllUserKeyByUserIdHandler,
  GetByUserIdUserKeyHandler,
  GetByRolIdHandler,
  GetAllPermissionHandler
];
const EventHandlers = [UserRegisteredHandler, PasswdChangedHandler];

/* eslint-disable @typescript-eslint/explicit-function-return-type */

// Módulo de NestJS para autenticación.
@Module({
  // Importa los módulos necesarios para la autenticación, como JwtModule.
  imports: [CqrsModule, JwtModule],
  // Controladores que manejan solicitudes HTTP relacionadas con la autenticación.
  controllers: [AuthController],
  // Proveedores para servicios y guardas utilizados en el módulo de autenticación.
  providers: [
    AuthService,
    TokenService,
    KeyService,
    RedisService,
    UserProjection,
    UserKeyProjection,
    EventStoreService,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    {
      provide: EventBusWithStore,
      useFactory: (eventBus: EventBus, eventStore: EventStoreService) =>
        new EventBusWithStore(eventBus, eventStore),
      inject: [EventBus, EventStoreService]
    }
  ]
})
export class AuthModule {}
