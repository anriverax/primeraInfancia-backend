import { Module, forwardRef } from "@nestjs/common";

// Catalogue modules
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt/dist";
import { ErrorHandlingModule } from "@/services/errorHandling/errorHandling.module";
import { GetAllMenuPermissionHandler } from "./application/handlers/getAll-menuPermission.handler";
import { PrismaMenuPermissionRepository } from "./infrastructure/prisma-menuPermission.respository";
import { CatalogueController } from "./presentation/catalogue.controller";
import { AuthModule } from "@/api/auth/auth.module";

const MenuPermissionQueryHandlers = [GetAllMenuPermissionHandler];

const MenuPermissionPortProviders = [
  {
    provide: "IMenuPermissionRepository",
    useClass: PrismaMenuPermissionRepository
  }
];

@Module({
  imports: [CqrsModule, JwtModule, ErrorHandlingModule, forwardRef(() => AuthModule)],
  providers: [...MenuPermissionPortProviders, ...MenuPermissionQueryHandlers],
  controllers: [CatalogueController],
  exports: ["IMenuPermissionRepository"]
})
export class MenuPermissionModule {}
