import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { GetAllSchoolPaginationHandler } from "./cqrs/queries/pagination/getAllSchoolPagination.handler";
import { SchoolController } from "./school.controller";
import { AddSchoolHandler } from "./cqrs/commands/addSchool.handler";
import { SchoolProjection } from "./cqrs/projections/school.projection";
import { GetByIdSchoolHandler } from "./cqrs/queries/findUnique/getByIdSchool.handler";
import { ErrorHandlingModule } from "@/services/errorHandling/errorHandling.module";

const SchoolCommandHandlers = [AddSchoolHandler];
const QueryHandlers = [GetAllSchoolPaginationHandler, GetByIdSchoolHandler];

@Module({
  imports: [CqrsModule, JwtModule, ErrorHandlingModule],
  controllers: [SchoolController],
  providers: [SchoolProjection, ...SchoolCommandHandlers, ...QueryHandlers]
})
export class SchoolModule {}
