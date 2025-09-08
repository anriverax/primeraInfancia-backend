import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { GroupController } from "./group.controller";
import { Module } from "@nestjs/common";
import { GetByIdGroupHandler } from "./cqrs/queries/group/findUnique/getByIdGroup.handler";
import { GetAllGroupPaginationHandler } from "./cqrs/queries/group/pagination/getAllGroupPagination.handler";
import { GroupService } from "./services/group.service";
import { FindMentorByUserIdHandler } from "./cqrs/queries/mentorAssignment/findMentorByUser.handler";

const CommandHandlers = [];
const QueryHandlers = [GetByIdGroupHandler, GetAllGroupPaginationHandler, FindMentorByUserIdHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [GroupController],
  providers: [...CommandHandlers, ...QueryHandlers, GroupService]
})
export class GroupModule {}
