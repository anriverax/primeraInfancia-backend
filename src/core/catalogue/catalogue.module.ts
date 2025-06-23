import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { DepartmentModule } from "../coutry/department/department.module";
import { CatalogueController } from "./catalogue.controller";
import { GetAllTypePersonHandler } from "./query/getAllTypePerson.handler";
import { S3Service } from "@/services/s3.service";

const TypePersonQueryHandlers = [GetAllTypePersonHandler];

@Module({
  imports: [CqrsModule, DepartmentModule],
  controllers: [CatalogueController],
  providers: [...TypePersonQueryHandlers, S3Service]
})
export class CatalogueModule {}
