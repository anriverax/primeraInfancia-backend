import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { GroupController } from "./group.controller";
import { Module } from "@nestjs/common";
import { GetByIdGroupHandler } from "./cqrs/queries/findUnique/getByIdGroup.handler";
import { GetAllGroupPaginationHandler } from "./cqrs/queries/getAllGroupPagination.query";
import { GroupService } from "./services/group.service";
import { GetGroupByUserHandler } from "./cqrs/queries/getGroupByUser/getGroupByUser.query";

const CommandHandlers = [];
const QueryHandlers = [GetByIdGroupHandler, GetAllGroupPaginationHandler, GetGroupByUserHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [GroupController],
  providers: [...CommandHandlers, ...QueryHandlers, GroupService]
})
export class GroupModule {}
