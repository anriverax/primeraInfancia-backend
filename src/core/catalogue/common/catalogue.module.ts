import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { DepartmentModule } from "../../test/coutry/department/department.module";
import { S3Service } from "@/services/s3.service";
import { JwtModule } from "@nestjs/jwt";
import { CatalogueController } from "./catalogue.controller";
import { GetAllTypePersonHandler } from "./query/typePerson-findMany/getAllTypePerson.handler";
import { GetAllPersonHandler } from "./query/person-findMany/getAllPerson.handler";
import { GetAllRolePermissionHandler } from "./query/permission-findMany/getAllRolePermission.handler";

const CatalogueQueryHandlers = [
  GetAllTypePersonHandler,
  GetAllPersonHandler,
  GetAllRolePermissionHandler
];

@Module({
  imports: [CqrsModule, JwtModule, DepartmentModule],
  controllers: [CatalogueController],
  providers: [...CatalogueQueryHandlers, S3Service]
})
export class CatalogueModule {}
