import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllResponseSessionHandler } from "./cqrs/queries/findMany/getAllResponseSession.handler";
import { ResponseSessionProjection } from "./cqrs/projections/responseSession.projection";
import { ResponseSessionController } from "./responseSession.controller";
import { CreateResponseSessionHandler } from "./cqrs/commands/create/createResponseSession.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdResponseSessionHandler } from "./cqrs/queries/findUnique/getByIdResponseSession.handler";
import { DeleteResponseSessionHandler } from "./cqrs/commands/delete/deleteResponseSession.handler";
import { UpdateResponseSessionHandler } from "./cqrs/commands/update/updateResponseSession.handler";

const CommandHandlers = [
  CreateResponseSessionHandler,
  UpdateResponseSessionHandler,
  DeleteResponseSessionHandler
];
const QueryHandlers = [GetAllResponseSessionHandler, GetByIdResponseSessionHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [ResponseSessionController],
  providers: [ResponseSessionProjection, ...CommandHandlers, ...QueryHandlers]
})
export class ResponseSessionModule {}
