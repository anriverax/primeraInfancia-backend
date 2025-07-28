import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllEnrollmentMentorHandler } from "./cqrs/queries/findMany/getAllEnrollmentMentor.handler";
import { EnrollmentMentorProjection } from "./cqrs/projections/enrollmentMentor.projection";
import { EnrollmentMentorController } from "./enrollmentMentor.controller";
import { CreateEnrollmentMentorHandler } from "./cqrs/commands/create/createEnrollmentMentor.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdEnrollmentMentorHandler } from "./cqrs/queries/findUnique/getByIdEnrollmentMentor.handler";
import { DeleteEnrollmentMentorHandler } from "./cqrs/commands/delete/deleteEnrollmentMentor.handler";
import { UpdateEnrollmentMentorHandler } from "./cqrs/commands/update/updateEnrollmentMentor.handler";

const CommandHandlers = [
  CreateEnrollmentMentorHandler,
  UpdateEnrollmentMentorHandler,
  DeleteEnrollmentMentorHandler
];
const QueryHandlers = [GetAllEnrollmentMentorHandler, GetByIdEnrollmentMentorHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [EnrollmentMentorController],
  providers: [EnrollmentMentorProjection, ...CommandHandlers, ...QueryHandlers]
})
export class EnrollmentMentorModule {}
