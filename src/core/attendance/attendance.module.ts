import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { AttendanceController } from "./attendance.controller";
import { AttendanceSessionProjection } from "./cqrs/projections/attendanceSession.projection";
import { UpdateAttendanceHandler } from "./cqrs/command/update/updateAttendance.handler";
import { MentorAssignmentService } from "./services/mentorAssignment.service";
import { GetTeacherAssignmentsByUserIdHandler } from "./cqrs/queries/mentorAssignment/getTeacherAssignmentsByUserId.query";
import { GetMentorsAssignedToUserHandler } from "./cqrs/queries/mentorAssignment/getMentorsAssignedToUser.query";
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

const AttendanceCommandHandlers = [
  CreateAttendanceSessionHandler,
  CreateEventAttendanceHandler,
  UpdateAttendanceHandler
];

const AttendanceQueryHandlers = [
  GetGroupStaffByUserHandler,
  GetAllSessionsBySupportHandler,
  FindPersonByUserHandler,
  FindLastAttendanceHandler,
  GetTeacherAssignmentsByUserIdHandler,
  GetMentorsAssignedToUserHandler,
  GetAllEventsByUserHandler,
  FindGroupIdByUserIdHandler,
  GetAllSupportByGroupIdHandler,
  GetResposibleHandler,
  GetAllInscriptionByUserHandler
];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [AttendanceController],
  providers: [
    AttendanceSessionProjection,
    EventAttendanceProjection,
    ...AttendanceCommandHandlers,
    ...AttendanceQueryHandlers,
    MentorAssignmentService
  ]
})
export class AttendanceModule {}
