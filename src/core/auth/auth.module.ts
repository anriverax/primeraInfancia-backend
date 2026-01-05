import { Module } from "@nestjs/common";
import { CqrsModule, EventBus } from "@nestjs/cqrs";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { RegisterUserHandler } from "./cqrs/commands/register/register-user.command";
import { UserProjection } from "./cqrs/projections/user.projection";
import { UserKeyProjection } from "./cqrs/projections/userkey.projection";
import { EventBusWithStore } from "@/services/events/eventBusWithStore";
import { EventStoreService } from "@/services/events/eventStore.service";
import { RedisService } from "@/services/redis/redis.service";
import { TokenService } from "./services/token.service";
import { KeyService } from "./services/key.service";
import { JwtModule } from "@nestjs/jwt";
import { ChangePasswdHandler } from "./cqrs/commands/change-passwd/change-passwd.handler";
import { GetAllPermissionHandler } from "./cqrs/queries/menuPermission/get-all-permission.handler";
import { GetByRolIdHandler } from "./cqrs/queries/role/get-by-rol-id.handler";
import { GetByUserIdUserKeyHandler } from "./cqrs/queries/userKey/findFirst/get-by-userId-userKey.handler";
import { GetAllUserKeyByUserIdHandler } from "./cqrs/queries/userKey/findMany/get-all-userKey-by-userId.handler";
import { FindUniqueUserQueryHandler } from "./cqrs/queries/user/find-unique-user.query";

const CommandHandlers = [RegisterUserHandler, ChangePasswdHandler];

const QueryHandlers = [
  FindUniqueUserQueryHandler,
  GetAllUserKeyByUserIdHandler,
  GetByUserIdUserKeyHandler,
  GetByRolIdHandler,
  GetAllPermissionHandler
];

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
    {
      provide: EventBusWithStore,
      useFactory: (eventBus: EventBus, eventStore: EventStoreService) =>
        new EventBusWithStore(eventBus, eventStore),
      inject: [EventBus, EventStoreService]
    }
  ]
})
export class AuthModule {}
