import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { GroupLeaderController } from "./groupLeader.controller";
import { GetAllPersonByTypePersonHandler } from "../helper/cqrs/queries/person-findMany/getAllPersonByTypePerson.handler";

const GroupLeaderCommandHandlers = [GetAllPersonByTypePersonHandler];
const GroupLeaderQueryHandlers = [GetAllPersonByTypePersonHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [GroupLeaderController],
  providers: [...GroupLeaderQueryHandlers, ...GroupLeaderCommandHandlers]
})
export class GroupLeaderModule {}
