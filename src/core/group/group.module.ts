import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { GroupController } from "./group.controller";
import { Module } from "@nestjs/common";
import { GetByIdGroupHandler, GetByIdGroupGradeDetailHandler } from "./cqrs/queries/group/findUnique/getByIdGroup.handler";
import { GetAllGroupPaginationHandler } from "./cqrs/queries/group/pagination/getAllGroupPagination.handler";
import { GroupService } from "./services/group.service";

const CommandHandlers = [];
const QueryHandlers = [GetByIdGroupHandler, GetAllGroupPaginationHandler, GetByIdGroupGradeDetailHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [GroupController],
  providers: [...CommandHandlers, ...QueryHandlers, GroupService]
})
export class GroupModule {}
