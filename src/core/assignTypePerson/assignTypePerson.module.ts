import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { AssignTypePersonController } from "./assignTypePerson.controller";
import { GetAllPersonByTypePersonHandler } from "../helper/cqrs/queries/person-findMany/getAllPersonByTypePerson.handler";
import { AssignTypePersonProjection } from "./cqrs/projections/assignTypePerson.projection";
import { DeleteAssignTypePersonHandler } from "./cqrs/command/groupLeader/delete/deleteAssignTypePerson.handler";
import { CreateAssignTypePersonHandler } from "./cqrs/command/groupLeader/create/createAssignTypePerson.handler";
import { getAllPersonRoleHandler } from "./cqrs/queries/personRole-findMany/getAllPersonRole.handler";
import { InscriptionProjection } from "./cqrs/projections/inscription.projection";
import { CreateInscriptionHandler } from "./cqrs/command/inscription/create/createAssignTypePerson.handler";

const AssignTypePersonCommandHandlers = [
  CreateAssignTypePersonHandler,
  DeleteAssignTypePersonHandler,
  CreateInscriptionHandler
];
const AssignTypePersonQueryHandlers = [GetAllPersonByTypePersonHandler, getAllPersonRoleHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [AssignTypePersonController],
  providers: [
    AssignTypePersonProjection,
    InscriptionProjection,
    ...AssignTypePersonQueryHandlers,
    ...AssignTypePersonCommandHandlers
  ]
})
export class AssignTypePersonModule {}
