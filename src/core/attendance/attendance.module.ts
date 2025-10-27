import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { AttendanceController } from "./attendance.controller";
import { CreateAttendanceHandler } from "./cqrs/command/create/createAttendance.command";
import { GetPersonRoleByUserHandler } from "./cqrs/queries/PersonRole/getPersonRoleByUser.handler";
import { AttendanceProjection } from "./cqrs/projections/attendance.projection";
import { FindLastAttendanceHandler } from "./cqrs/queries/attendance/findLastAttendance.handler";
import { UpdateAttendanceHandler } from "./cqrs/command/update/updateAttendance.handler";
import { GetAllAttendancePaginationHandler } from "./cqrs/queries/pagination/getAllAttendancePagination.handler";
import { MentorAssignmentService } from "./services/mentorAssignment.service";
import { GetAllEventHandler } from "./cqrs/queries/event/getAllEvent.handler";
import { FindByUserIdHandler } from "./cqrs/queries/mentorAssignment/findByUser.handler";

const AttendanceCommandHandlers = [CreateAttendanceHandler, UpdateAttendanceHandler];
const AttendanceQueryHandlers = [
  GetPersonRoleByUserHandler,
  FindLastAttendanceHandler,
  GetAllAttendancePaginationHandler,
  GetAllEventHandler,
  FindByUserIdHandler
];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [AttendanceController],
  providers: [
    AttendanceProjection,
    ...AttendanceCommandHandlers,
    ...AttendanceQueryHandlers,
    MentorAssignmentService
  ]
})
export class AttendanceModule {}
