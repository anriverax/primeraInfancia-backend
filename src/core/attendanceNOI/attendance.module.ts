import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { AttendanceController } from "./attendance.controller";
import { GetPersonRoleByUserHandler } from "./cqrs/queries/PersonRole/getPersonRoleByUser.handler";
import { AttendanceSessionProjection } from "./cqrs/projections/attendanceSession.projection";
import { FindLastAttendanceHandler } from "./cqrs/queries/attendance/findLastAttendance.handler";
import { UpdateAttendanceHandler } from "./cqrs/command/update/updateAttendance.handler";
import { MentorAssignmentService } from "./services/mentorAssignment.service";
import { GetTeacherAssignmentsByUserIdHandler } from "./cqrs/queries/mentorAssignment/getTeacherAssignmentsByUserId.query";
import { GetMentorsAssignedToUserHandler } from "./cqrs/queries/mentorAssignment/getMentorsAssignedToUser.query";
import { CreateAttendanceHandler } from "./cqrs/command/create/createAttendance.command";
import { GetGroupStaffByUserHandler } from "../attendance/cqrs/queries/groupStaff/get-groupStaff-by-user.handler";

const AttendanceCommandHandlers = [CreateAttendanceHandler, UpdateAttendanceHandler];
const AttendanceQueryHandlers = [
  GetGroupStaffByUserHandler,
  GetPersonRoleByUserHandler,
  FindLastAttendanceHandler,
  GetTeacherAssignmentsByUserIdHandler,
  GetMentorsAssignedToUserHandler
];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [AttendanceController],
  providers: [
    AttendanceSessionProjection,
    ...AttendanceCommandHandlers,
    ...AttendanceQueryHandlers,
    MentorAssignmentService
  ]
})
export class AttendanceModule {}
