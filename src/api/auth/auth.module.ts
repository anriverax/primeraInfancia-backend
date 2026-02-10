import { Module } from "@nestjs/common";
import { CqrsModule, EventBus } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
// CQRS Handlers
import { GetAllPermissionHandler } from "./application/handlers/getAll-permission.handler";
// Command Handlers
import { CreateUserHandler } from "./application/handlers/create-user.handler";
import { LoginHandler } from "./application/handlers/login.handler";
import { ChangePasswdHandler } from "./application/handlers/change-passwd.handler";
// Query Handlers
import { FindUniqueUserByIdHandler } from "./application/handlers/findUnique-user-byId.handler";
import { FindUniqueRolByEmailHandler } from "./application/handlers/findUnique-rol-byEmail.handler";
// Domain Services
import { AuthDomainService } from "./domain/services/authDomain.service";
// Adapters (Ports Implementation)
import { ArgonPasswordHasher } from "./infrastructure/adapters/argon-password-hasher";
import { JwtTokenGenerator } from "./infrastructure/adapters/jwt-token-generator";
import { PrismaPersonRepository } from "./infrastructure/adapters/prisma-person.repository";
import { RedisAccountSecurity } from "./infrastructure/adapters/redis-account-security.adapter";
// Event Store
import { EventBusWithStore } from "@/services/events/eventBusWithStore";
import { EventStoreService } from "@/services/events/eventStore.service";
// Modules
import { ErrorHandlingModule } from "@/services/errorHandling/errorHandling.module";
import { PrismaService } from "@/services/prisma/prisma.service";
// Projections
import { UserProjection } from "./application/projections/user.projection";
import { PersonProjection } from "./application/projections/person.projection";
// Controllers
import { AuthController } from "./presentation/auth.controller";
import { KeyGenerator } from "./infrastructure/adapters/key-generator.service";
import { PrismaUserRepository } from "@/api/auth/infrastructure/adapters/prisma-user.repository";
import { MenuPermissionModule } from "../catalogue/menuPermission/menuPermission.module";

const AuthCommandHandlers = [CreateUserHandler, ChangePasswdHandler, LoginHandler];
const AuthQueryHandlers = [
  FindUniqueUserByIdHandler,
  FindUniqueRolByEmailHandler,
  GetAllPermissionHandler
];
const AuthProjectionProviders = [UserProjection, PersonProjection];
// Port Providers (DI Configuration)
const AuthProviders = [
  {
    provide: "IPasswordHasher",
    useClass: ArgonPasswordHasher
  },
  {
    provide: "ITokenGenerator",
    useClass: JwtTokenGenerator
  },
  {
    provide: "IKeyGenerator",
    useClass: KeyGenerator
  },
  {
    provide: "IRedisAccountSecurity",
    useClass: RedisAccountSecurity
  },
  {
    provide: "IUserRepository",
    useClass: PrismaUserRepository
  },
  {
    provide: "IPersonRepository",
    useClass: PrismaPersonRepository
  }
];

/* eslint-disable @typescript-eslint/explicit-function-return-type */
@Module({
  imports: [CqrsModule, JwtModule, ErrorHandlingModule, MenuPermissionModule],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthDomainService,
    EventStoreService,
    ...AuthCommandHandlers,
    ...AuthQueryHandlers,
    ...AuthProviders,
    ...AuthProjectionProviders,
    {
      provide: EventBusWithStore,
      useFactory: (eventBus: EventBus, eventStore: EventStoreService) =>
        new EventBusWithStore(eventBus, eventStore),
      inject: [EventBus, EventStoreService]
    }
  ],
  exports: [
    "IUserRepository",
    "IPersonRepository",
    UserProjection,
    PersonProjection,
    AuthDomainService,
    EventStoreService,
    EventBusWithStore
  ]
})
export class AuthModule {}
