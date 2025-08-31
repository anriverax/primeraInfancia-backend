import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllQuestionHandler } from "./cqrs/queries/findMany/getAllQuestion.handler";
import { QuestionProjection } from "./cqrs/projections/question.projection";
import { QuestionController } from "./question.controller";
import { CreateQuestionHandler } from "./cqrs/commands/create/createQuestion.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdQuestionHandler } from "./cqrs/queries/findUnique/getByIdQuestion.handler";
import { DeleteQuestionHandler } from "./cqrs/commands/delete/deleteQuestion.handler";
import { UpdateQuestionHandler } from "./cqrs/commands/update/updateQuestion.handler";

const CommandHandlers = [CreateQuestionHandler, UpdateQuestionHandler, DeleteQuestionHandler];
const QueryHandlers = [GetAllQuestionHandler, GetByIdQuestionHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [QuestionController],
  providers: [QuestionProjection, ...CommandHandlers, ...QueryHandlers]
})
export class QuestionModule {}
