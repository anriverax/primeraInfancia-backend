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
import { TokenService } from "../../services/token-store/token.service";
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
    // Services
    AuthService,
    TokenService,
    KeyService,
    RedisService,
    // Projections
    UserProjection,
    UserKeyProjection,
    // Infrastructure
    EventStoreService,
    // CQRS Handlers
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

/**
 * import { Module } from "@nestjs/common";
import { CqrsModule, EventBus } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";

// Controllers
import { AuthController } from "./auth.controller";

// Services
import { AuthService } from "./services/auth.service";
import { TokenService } from "./services/token.service";
import { KeyService } from "./services/key.service";

// Token Store
import { ITokenStore } from "./services/token-store/token-store.interface";
import { RedisTokenStore } from "./services/token-store/redis-token-store";

// CQRS Handlers
import { RegisterUserHandler } from "./cqrs/commands/register/register-user.command";
import { ChangePasswdHandler } from "./cqrs/commands/change-passwd/change-passwd.handler";
import { FindUniqueUserQueryHandler } from "./cqrs/queries/user/find-unique-user.query";
import { GetAllUserKeyByUserIdHandler } from "./cqrs/queries/userKey/findMany/get-all-userKey-by-userId.handler";
import { GetByUserIdUserKeyHandler } from "./cqrs/queries/userKey/findFirst/get-by-userId-userKey.handler";
import { GetByRolIdHandler } from "./cqrs/queries/role/get-by-rol-id.handler";
import { GetAllPermissionHandler } from "./cqrs/queries/menuPermission/get-all-permission.handler";

// Projections
import { UserProjection } from "./cqrs/projections/user.projection";
import { UserKeyProjection } from "./cqrs/projections/userkey.projection";

// Infrastructure
import { EventBusWithStore } from "@/services/events/eventBusWithStore";
import { EventStoreService } from "@/services/events/eventStore.service";
import { RedisService } from "@/services/redis/redis.service";

const CommandHandlers = [RegisterUserHandler, ChangePasswdHandler];
const QueryHandlers = [
  FindUniqueUserQueryHandler,
  GetAllUserKeyByUserIdHandler,
  GetByUserIdUserKeyHandler,
  GetByRolIdHandler,
  GetAllPermissionHandler
];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [AuthController],
  providers: [
    // Token Store (registrar la interfaz con su implementación)
    {
      provide: ITokenStore,
      useClass: RedisTokenStore
    },

    // Services
    AuthService,
    TokenService,
    KeyService,
    RedisService,

    // Projections
    UserProjection,
    UserKeyProjection,

    // Infrastructure
    EventStoreService,

    // CQRS Handlers
    ...CommandHandlers,
    ...QueryHandlers,

    // Event Bus with Store
    {
      provide: EventBusWithStore,
      useFactory: (eventBus: EventBus, eventStore: EventStoreService) =>
        new EventBusWithStore(eventBus, eventStore),
      inject: [EventBus, EventStoreService]
    }
  ],
  exports: [AuthService, TokenService, KeyService]
})
export class AuthModule {}
 */
