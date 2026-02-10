import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { MenuPermissionController } from "./menuPermission.controller";
import { GetAllRolePermissionHandler } from "./query/permission-findMany/getAllRolePermission.handler";

const MenuPermissionQueryHandlers = [GetAllRolePermissionHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [MenuPermissionController],
  providers: [...MenuPermissionQueryHandlers]
})
export class MenuPermissionModule {}
