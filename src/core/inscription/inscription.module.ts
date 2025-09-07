import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllInscriptionHandler } from "./cqrs/queries/findMany/getAllInscription.handler";
import { InscriptionProjection } from "./cqrs/projections/inscription.projection";
import { InscriptionController } from "./inscription.controller";
import { CreateInscriptionHandler } from "./cqrs/commands/create/createInscription.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdInscriptionHandler } from "./cqrs/queries/findUnique/getByIdInscription.handler";
import { DeleteInscriptionHandler } from "./cqrs/commands/delete/deleteInscription.handler";
import { UpdateInscriptionHandler } from "./cqrs/commands/update/updateInscription.handler";

const CommandHandlers = [CreateInscriptionHandler, UpdateInscriptionHandler, DeleteInscriptionHandler];
const QueryHandlers = [GetAllInscriptionHandler, GetByIdInscriptionHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [InscriptionController],
  providers: [InscriptionProjection, ...CommandHandlers, ...QueryHandlers]
})
export class InscriptionModule {}
