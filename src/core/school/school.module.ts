import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllSchoolHandler } from "./cqrs/queries/findMany/getAllSchool.handler";
import { SchoolProjection } from "./cqrs/projections/school.projection";
import { SchoolController } from "./school.controller";
import { CreateSchoolHandler } from "./cqrs/commands/create/createSchool.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdSchoolHandler } from "./cqrs/queries/findUnique/getByIdSchool.handler";
import { DeleteSchoolHandler } from "./cqrs/commands/delete/deleteSchool.handler";
import { UpdateSchoolHandler } from "./cqrs/commands/update/updateSchool.handler";

const CommandHandlers = [CreateSchoolHandler, UpdateSchoolHandler, DeleteSchoolHandler];
const QueryHandlers = [GetAllSchoolHandler, GetByIdSchoolHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [SchoolController],
  providers: [SchoolProjection, ...CommandHandlers, ...QueryHandlers]
})
export class SchoolModule {}
