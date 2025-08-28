import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { GroupController } from "./group.controller";
import { GroupProjection } from "./cqrs/projections/group.projection";
import { Module } from "@nestjs/common";
import { GetAllGroupHandler } from "./cqrs/queries/group/findMany/getAllGroup.handler";
import { CreateGroupHandler } from "./cqrs/command/group/create/createGroup.handler";
import { DeleteGroupHandler } from "./cqrs/command/delete/deleteGroup.handler";
import { UpdateGroupHandler } from "./cqrs/command/update/updateGroup.handler";
import { GetByIdGroupHandler } from "./cqrs/queries/group/findUnique/getByIdGroup.handler";
import { GetAllTrainerHandler } from "./cqrs/queries/personRole/trainer/getAllTrainer.handler";
import { GetAllTeacherHandler } from "./cqrs/queries/personRole/teacher/getAllTeacher.handler";
import { GetAllMentorHandler } from "./cqrs/queries/personRole/mentor/getAllMentor.handler";
import { TeacherService } from "./services/teacher.service";
import { MentorService } from "./services/mentor.service";
import { AssignTeacherService } from "./services/assignTeacher.service";
import { CreateGroupMentorHandler } from "./cqrs/command/groupMentor/create/createGroup.handler";
import { GroupMentorProjection } from "./cqrs/projections/groupMentor.projection";

const CommandHandlers = [
  CreateGroupHandler,
  CreateGroupMentorHandler,
  UpdateGroupHandler,
  DeleteGroupHandler
];
const QueryHandlers = [
  GetAllGroupHandler,
  GetByIdGroupHandler,
  GetAllTrainerHandler,
  GetAllTeacherHandler,
  GetAllMentorHandler
];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [GroupController],
  providers: [
    GroupProjection,
    GroupMentorProjection,
    ...CommandHandlers,
    ...QueryHandlers,
    TeacherService,
    MentorService,
    AssignTeacherService
  ]
})
export class GroupModule {}
