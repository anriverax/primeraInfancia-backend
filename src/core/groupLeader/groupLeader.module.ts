import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { GroupLeaderController } from "./groupLeader.controller";
import { GetAllPersonByTypePersonHandler } from "../helper/cqrs/queries/person-findMany/getAllPersonByTypePerson.handler";
import { CreateGroupLeaderHandler } from "./cqrs/command/create/createGroupLeader.handler";
import { GroupLeaderProjection } from "./cqrs/projections/groupLeader.projection";

const GroupLeaderCommandHandlers = [CreateGroupLeaderHandler];
const GroupLeaderQueryHandlers = [GetAllPersonByTypePersonHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [GroupLeaderController],
  providers: [GroupLeaderProjection, ...GroupLeaderQueryHandlers, ...GroupLeaderCommandHandlers]
})
export class GroupLeaderModule {}
