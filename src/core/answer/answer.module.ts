import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllAnswerHandler } from "./cqrs/queries/findMany/getAllAnswer.handler";
import { AnswerProjection } from "./cqrs/projections/answer.projection";
import { AnswerController } from "./answer.controller";
import { CreateAnswerHandler } from "./cqrs/commands/create/createAnswer.handler";
import { JwtModule } from "@nestjs/jwt";

const QueryHandlers = [GetAllAnswerHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [AnswerController],
  providers: [AnswerProjection, CreateAnswerHandler, ...QueryHandlers]
})
export class AnswerModule {}
