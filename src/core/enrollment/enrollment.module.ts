import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllEnrollmentHandler } from "./cqrs/queries/findMany/getAllEnrollment.handler";
import { EnrollmentProjection } from "./cqrs/projections/enrollment.projection";
import { EnrollmentController } from "./enrollment.controller";
import { CreateEnrollmentHandler } from "./cqrs/commands/create/createEnrollment.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdEnrollmentHandler } from "./cqrs/queries/findUnique/getByIdEnrollment.handler";
import { DeleteEnrollmentHandler } from "./cqrs/commands/delete/deleteEnrollment.handler";
import { UpdateEnrollmentHandler } from "./cqrs/commands/update/updateEnrollment.handler";

const CommandHandlers = [CreateEnrollmentHandler, UpdateEnrollmentHandler, DeleteEnrollmentHandler];
const QueryHandlers = [GetAllEnrollmentHandler, GetByIdEnrollmentHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentProjection, ...CommandHandlers, ...QueryHandlers]
})
export class EnrollmentModule {}
