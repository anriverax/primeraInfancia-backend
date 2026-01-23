import { Module } from "@nestjs/common";
import { CqrsModule, EventBus } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
// CQRS Handlers
import { ChangePasswdHandler } from "./application/commands/change-passwd/change-passwd.handler";
import { GetAllPermissionHandler } from "./application/queries/menu-permission/get-all-permission.handler";
// Command Handlers
import { CreateUserHandler } from "./application/commands/create-user/create-user.handler";
import { LoginHandler } from "./application/commands/login/login.handler";
// Query Handlers
import { FindUserByIdQueryHandler } from "./application/queries/find-user/find-user-by-id.handler";
import { GetRolByIdQuery } from "./application/queries/get-rol/get-rol-by-id.query";
// Services
import { PasswordHashingService } from "./infrastructure/services/passwordHashing.service";
import { TokenManagementService } from "./application/services/tokenManagement.service";
import { AccountSecurityService } from "./application/services/accountSecurity.service";
import { KeyService } from "./infrastructure/services/key.service";

// Event Store
import { EventBusWithStore } from "@/services/events/eventBusWithStore";
import { EventStoreService } from "@/services/events/eventStore.service";
// Modules
import { ErrorHandlingModule } from "@/services/errorHandling/errorHandling.module";
import { PrismaService } from "@/services/prisma/prisma.service";
// Projections
import { UserProjection } from "./application/projections/user.projection";
// Controllers
import { AuthController } from "./presentation/auth.controller";
import { AuthDomainService } from "./application/services/authDomain.service";

const CommandHandlers = [CreateUserHandler, ChangePasswdHandler, LoginHandler];

const QueryHandlers = [FindUserByIdQueryHandler, GetRolByIdQuery, GetAllPermissionHandler];

/* eslint-disable @typescript-eslint/explicit-function-return-type */
@Module({
  imports: [CqrsModule, JwtModule, ErrorHandlingModule],
  controllers: [AuthController],
  providers: [
    PrismaService,
    PasswordHashingService,
    TokenManagementService,
    AccountSecurityService,
    KeyService,
    AuthDomainService,
    UserProjection,
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
