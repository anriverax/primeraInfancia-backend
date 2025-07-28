import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllPersonRoleHandler } from "./cqrs/queries/findMany/getAllPersonRole.handler";
import { PersonRoleProjection } from "./cqrs/projections/personRole.projection";
import { PersonRoleController } from "./personRole.controller";
import { CreatePersonRoleHandler } from "./cqrs/commands/create/createPersonRole.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdPersonRoleHandler } from "./cqrs/queries/findUnique/getByIdPersonRole.handler";
import { DeletePersonRoleHandler } from "./cqrs/commands/delete/deletePersonRole.handler";
import { UpdatePersonRoleHandler } from "./cqrs/commands/update/updatePersonRole.handler";

const CommandHandlers = [CreatePersonRoleHandler, UpdatePersonRoleHandler, DeletePersonRoleHandler];
const QueryHandlers = [GetAllPersonRoleHandler, GetByIdPersonRoleHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [PersonRoleController],
  providers: [PersonRoleProjection, ...CommandHandlers, ...QueryHandlers]
})
export class PersonRoleModule {}
