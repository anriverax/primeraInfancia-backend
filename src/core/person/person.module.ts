import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllPersonHandler } from "./cqrs/queries/findMany/getAllPerson.handler";
//import { PersonProjection } from "./cqrs/projections/person.projection";
import { PersonController } from "./person.controller";
//import { CreatePersonHandler } from "./cqrs/commands/create/createPerson.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdPersonHandler } from "./cqrs/queries/findUnique/getByIdPerson.handler";
// import { DeletePersonHandler } from "./cqrs/commands/delete/deletePerson.handler";
// import { UpdatePersonHandler } from "./cqrs/commands/update/updatePerson.handler";

//const CommandHandlers = [CreatePersonHandler, UpdatePersonHandler, DeletePersonHandler];
const QueryHandlers = [GetAllPersonHandler, GetByIdPersonHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [PersonController],
  //providers: [PersonProjection, ...CommandHandlers, ...QueryHandlers]
  providers: [...QueryHandlers]
})
export class PersonModule {}
