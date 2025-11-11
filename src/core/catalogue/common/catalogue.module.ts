import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { DepartmentModule } from "../department/department.module";
import { JwtModule } from "@nestjs/jwt";
import { CatalogueController } from "./catalogue.controller";
import { GetAllRolePermissionHandler } from "./query/permission-findMany/getAllRolePermission.handler";

const CatalogueQueryHandlers = [GetAllRolePermissionHandler];

@Module({
  imports: [CqrsModule, JwtModule, DepartmentModule],
  controllers: [CatalogueController],
  providers: [...CatalogueQueryHandlers]
})
export class CatalogueModule {}
