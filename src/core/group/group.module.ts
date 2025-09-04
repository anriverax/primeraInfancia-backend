import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { GroupController } from "./group.controller";
import { Module } from "@nestjs/common";
import { GetAllGroupHandler } from "./cqrs/queries/group/findMany/getAllGroup.handler";
import { GetByIdGroupHandler } from "./cqrs/queries/group/findUnique/getByIdGroup.handler";
import { GetAllGroupPaginationHandler } from "./cqrs/queries/group/pagination/getAllGroupPagination.handler";

const CommandHandlers = [];
const QueryHandlers = [GetAllGroupHandler, GetByIdGroupHandler, GetAllGroupPaginationHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [GroupController],
  providers: [...CommandHandlers, ...QueryHandlers]
})
export class GroupModule {}
