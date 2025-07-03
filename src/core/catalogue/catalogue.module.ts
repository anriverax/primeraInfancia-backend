import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { DepartmentModule } from "../test/coutry/department/department.module";
import { CatalogueController } from "./catalogue.controller";
import { S3Service } from "@/services/s3.service";
import { GetAllTypePersonHandler } from "./query/typePerson-findMany/getAllTypePerson.handler";
import { GetAllPersonHandler } from "./query/person-findMany/getAllPerson.handler";
import { JwtModule } from "@nestjs/jwt";

const CatalogueQueryHandlers = [GetAllTypePersonHandler, GetAllPersonHandler];

@Module({
  imports: [CqrsModule, JwtModule, DepartmentModule],
  controllers: [CatalogueController],
  providers: [...CatalogueQueryHandlers, S3Service]
})
export class CatalogueModule {}
