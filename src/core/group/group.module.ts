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
import { CreateGroupMentorHandler } from "./cqrs/command/groupMentor/create/createGroupMentor.handler";
import { GroupMentorProjection } from "./cqrs/projections/groupMentor.projection";
import { GroupService } from "./services/group.service";
import { GroupMentorService } from "./services/groupMentor.service";
import { InscriptionService } from "./services/inscription.service";
import { InscriptionProjection } from "./cqrs/projections/inscription.projection";
import { CreateInscriptionHandler } from "./cqrs/command/inscription/create/createInscription.handler";

const CommandHandlers = [
  CreateGroupHandler,
  CreateGroupMentorHandler,
  CreateInscriptionHandler,
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
    InscriptionProjection,
    ...CommandHandlers,
    ...QueryHandlers,
    TeacherService,
    MentorService,
    AssignTeacherService,
    GroupService,
    GroupMentorService,
    InscriptionService
  ]
})
export class GroupModule {}
