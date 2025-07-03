import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { GroupController } from "./group.controller";
import { GroupProjection } from "./cqrs/projections/group.projection";
import { Module } from "@nestjs/common";
import { GetAllGroupHandler } from "./cqrs/queries/findMany/getAllGroup.handler";
import { CreateGroupHandler } from "./cqrs/command/create/createGroup.handler";
import { DeleteGroupHandler } from "./cqrs/command/delete/deleteGroup.handler";
import { UpdateGroupHandler } from "./cqrs/command/update/updateGroup.handler";
import { GetByIdGroupHandler } from './cqrs/queries/findUnique/getByIdGroup.handler';

const CommandHandlers = [CreateGroupHandler, UpdateGroupHandler, DeleteGroupHandler];
const QueryHandlers = [GetAllGroupHandler, GetByIdGroupHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [GroupController],
  providers: [GroupProjection, ...CommandHandlers, ...QueryHandlers]
})
export class GroupModule {}
