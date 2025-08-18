import { Module } from "@nestjs/common";
import { AddSchoolHandler } from "./cqrs/commands/addSchool.handler";
import { SchoolProjection } from "./cqrs/projections/school.projection";
import { SchoolController } from "./school.controller";
import { CqrsModule } from "@nestjs/cqrs";

const SchoolCommandHandlers = [AddSchoolHandler];

@Module({
  imports: [CqrsModule],

  controllers: [SchoolController],

  providers: [SchoolProjection, ...SchoolCommandHandlers],
  exports: []
})
export class SchoolModule {}
