import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PermissionController } from "./permission.controller";
import { MenuPermissionProjection } from "./cqrs/projections/menuPermission.projection";
import { AddMenuPermissionHandler } from "./cqrs/command/menuPermission/addMenuPermission.handler";
import { GetAllMenuPermissionHandler } from "./cqrs/queries/getAllMenuPermission.handler";
import { AddRolePermissionHandler } from "./cqrs/command/rolePermission/addRolePermission.handler";

const PermissionCommandHandlers = [AddMenuPermissionHandler, AddRolePermissionHandler];
const PermissionQueryHandlers = [GetAllMenuPermissionHandler];

@Module({
  imports: [CqrsModule],
  controllers: [PermissionController],
  providers: [MenuPermissionProjection, ...PermissionCommandHandlers, ...PermissionQueryHandlers]
})
export class PermissionModule {}
