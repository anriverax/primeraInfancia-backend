import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllMultipleAnswerHandler } from "./cqrs/queries/findMany/getAllMultipleAnswer.handler";
import { MultipleAnswerProjection } from "./cqrs/projections/multipleAnswer.projection";
import { MultipleAnswerController } from "./multipleAnswer.controller";
import { CreateMultipleAnswerHandler } from "./cqrs/commands/create/createMultipleAnswer.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdMultipleAnswerHandler } from "./cqrs/queries/findUnique/getByIdMultipleAnswer.handler";
import { DeleteMultipleAnswerHandler } from "./cqrs/commands/delete/deleteMultipleAnswer.handler";
import { UpdateMultipleAnswerHandler } from "./cqrs/commands/update/updateMultipleAnswer.handler";

const CommandHandlers = [CreateMultipleAnswerHandler, UpdateMultipleAnswerHandler, DeleteMultipleAnswerHandler];
const QueryHandlers = [GetAllMultipleAnswerHandler, GetByIdMultipleAnswerHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [MultipleAnswerController],
  providers: [MultipleAnswerProjection, ...CommandHandlers, ...QueryHandlers]
})
export class MultipleAnswerModule {}
