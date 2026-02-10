import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { AttendanceController } from "./attendance.controller";
import { AttendanceSessionProjection } from "./cqrs/projections/attendanceSession.projection";
import { UpdateAttendanceHandler } from "./cqrs/command/update/updateAttendance.handler";
import { GetAllEventsByUserHandler } from "./cqrs/queries/events/get-all-events-by-user.query";
import { FindGroupIdByUserIdHandler } from "./cqrs/queries/support/find-groupId-by-userId.handler";
import { GetAllSupportByGroupIdHandler } from "./cqrs/queries/support/get-all-support-by-groupId.handler";
import { GetResposibleHandler } from "./cqrs/queries/support/get-resposible.handler";
import { GetAllInscriptionByUserHandler } from "./cqrs/queries/inscriptions/get-all-inscription-by-user.handler";
import { CreateAttendanceSessionHandler } from "./cqrs/command/attendanceSession/create-attendanceSession.handler";
import { CreateEventAttendanceHandler } from "./cqrs/command/eventAttendance/create-eventAttendance.handler";
import { EventAttendanceProjection } from "./cqrs/projections/eventAttendance.projection";
import { FindLastAttendanceHandler } from "./cqrs/queries/attendance/find-lastAttendance.handler";
import { FindPersonByUserHandler } from "./cqrs/queries/person/find-person-byUser.handler";
import { GetGroupStaffByUserHandler } from "./cqrs/queries/groupStaff/get-groupStaff-by-user.handler";
import { GetAllSessionsBySupportHandler } from "./cqrs/queries/attendanceSession/get-all-sessions-by-support.handler";
import { GetAllAbsenceClassHandler } from "./cqrs/queries/absenceClassification/get-all-absenceClass.query";
import { CreateAttendanceExceptionHandler } from "./cqrs/command/attendanceException/create-attendanceException.handler";
import { AttendanceExceptionProjection } from "./cqrs/projections/exceptionAttendance.projection";
import { UpdateAttendanceSessionHandler } from "./cqrs/command/attendanceSession/update-attendanceSession.handler";
import { UpdateEventAttendanceHandler } from "./cqrs/command/eventAttendance/update-eventAttendance.handler";

const AttendanceCommandHandlers = [
  CreateAttendanceSessionHandler,
  CreateEventAttendanceHandler,
  UpdateAttendanceHandler,
  CreateAttendanceExceptionHandler,
  UpdateAttendanceSessionHandler,
  UpdateEventAttendanceHandler
];

const AttendanceQueryHandlers = [
  GetGroupStaffByUserHandler,
  GetAllSessionsBySupportHandler,
  FindPersonByUserHandler,
  FindLastAttendanceHandler,
  GetAllEventsByUserHandler,
  FindGroupIdByUserIdHandler,
  GetAllSupportByGroupIdHandler,
  GetAllAbsenceClassHandler,
  GetResposibleHandler,
  GetAllInscriptionByUserHandler
];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [AttendanceController],
  providers: [
    AttendanceSessionProjection,
    AttendanceExceptionProjection,
    EventAttendanceProjection,
    ...AttendanceCommandHandlers,
    ...AttendanceQueryHandlers
  ]
})
export class AttendanceModule {}
