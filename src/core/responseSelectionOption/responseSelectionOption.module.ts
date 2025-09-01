import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllResponseSelectionOptionHandler } from "./cqrs/queries/findMany/getAllResponseSelectionOption.handler";
import { ResponseSelectionOptionProjection } from "./cqrs/projections/responseSelectionOption.projection";
import { ResponseSelectionOptionController } from "./responseSelectionOption.controller";
import { CreateResponseSelectionOptionHandler } from "./cqrs/commands/create/createResponseSelectionOption.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdResponseSelectionOptionHandler } from "./cqrs/queries/findUnique/getByIdResponseSelectionOption.handler";
import { DeleteResponseSelectionOptionHandler } from "./cqrs/commands/delete/deleteResponseSelectionOption.handler";
import { UpdateResponseSelectionOptionHandler } from "./cqrs/commands/update/updateResponseSelectionOption.handler";

const CommandHandlers = [CreateResponseSelectionOptionHandler, UpdateResponseSelectionOptionHandler, DeleteResponseSelectionOptionHandler];
const QueryHandlers = [GetAllResponseSelectionOptionHandler, GetByIdResponseSelectionOptionHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [ResponseSelectionOptionController],
  providers: [ResponseSelectionOptionProjection, ...CommandHandlers, ...QueryHandlers]
})
export class ResponseSelectionOptionModule {}
