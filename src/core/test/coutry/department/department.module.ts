import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AddDepartmentHandler } from "./cqrs/commands/addDepartment.handler";
import { GetAllDepartmentHandler } from "./cqrs/queries/getAllDepartment.handler";
import { DepartmentProjection } from "./cqrs/projections/department.projection";
import { DepartmentController } from "./department.controller";

const DepartmentCommandHandlers = [AddDepartmentHandler];
const DepartmentQueryHandlers = [GetAllDepartmentHandler];

@Module({
  imports: [CqrsModule],

  controllers: [DepartmentController],

  providers: [DepartmentProjection, ...DepartmentCommandHandlers, ...DepartmentQueryHandlers],
  exports: [...DepartmentQueryHandlers]
})
export class DepartmentModule {}
