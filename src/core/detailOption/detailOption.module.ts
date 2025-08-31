import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllDetailOptionHandler } from "./cqrs/queries/findMany/getAllDetailOption.handler";
import { DetailOptionProjection } from "./cqrs/projections/detailOption.projection";
import { DetailOptionController } from "./detailOption.controller";
import { CreateDetailOptionHandler } from "./cqrs/commands/create/createDetailOption.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdDetailOptionHandler } from "./cqrs/queries/findUnique/getByIdDetailOption.handler";
import { DeleteDetailOptionHandler } from "./cqrs/commands/delete/deleteDetailOption.handler";
import { UpdateDetailOptionHandler } from "./cqrs/commands/update/updateDetailOption.handler";

const CommandHandlers = [CreateDetailOptionHandler, UpdateDetailOptionHandler, DeleteDetailOptionHandler];
const QueryHandlers = [GetAllDetailOptionHandler, GetByIdDetailOptionHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [DetailOptionController],
  providers: [DetailOptionProjection, ...CommandHandlers, ...QueryHandlers]
})
export class DetailOptionModule {}
