import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AddDepartmentHandler } from "./cqrs/commands/add-department.command";
import { GetAllDepartmentHandler } from "./cqrs/queries/get-all-department.query";
import { DepartmentProjection } from "./cqrs/projections/department.projection";
import { DepartmentController } from "./department.controller";
import { JwtModule } from "@nestjs/jwt";

/**
 * NestJS module bundling Department catalogue related controller, CQRS handlers and projection layer.
 *
 * Exports query handlers for usage in other modules if required.
 *
 * Suggested naming improvements (non-breaking suggestions only):
 * - `DepartmentProjection` could be renamed to `DepartmentRepository` to better reflect data access responsibility.
 */

/**
 * Collection of command handlers for Department write operations.
 */
const DepartmentCommandHandlers = [AddDepartmentHandler];
/**
 * Collection of query handlers for Department read operations.
 * Note: Class `GetAllDepartmentHandler` could be pluralized to `GetAllDepartmentsHandler` for consistency with the query name.
 */
const DepartmentQueryHandlers = [GetAllDepartmentHandler];

@Module({
  imports: [CqrsModule, JwtModule],

  controllers: [DepartmentController],

  providers: [DepartmentProjection, ...DepartmentCommandHandlers, ...DepartmentQueryHandlers],
  exports: [...DepartmentQueryHandlers]
})
export class DepartmentModule {}
