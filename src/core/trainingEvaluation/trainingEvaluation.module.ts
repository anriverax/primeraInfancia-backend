import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllTrainingEvaluationHandler } from "./cqrs/queries/findMany/getAllTrainingEvaluation.handler";
import { TrainingEvaluationProjection } from "./cqrs/projections/trainingEvaluation.projection";
import { TrainingEvaluationController } from "./trainingEvaluation.controller";
import { CreateTrainingEvaluationHandler } from "./cqrs/commands/create/createTrainingEvaluation.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdTrainingEvaluationHandler } from "./cqrs/queries/findUnique/getByIdTrainingEvaluation.handler";
import { DeleteTrainingEvaluationHandler } from "./cqrs/commands/delete/deleteTrainingEvaluation.handler";
import { UpdateTrainingEvaluationHandler } from "./cqrs/commands/update/updateTrainingEvaluation.handler";

const CommandHandlers = [
  CreateTrainingEvaluationHandler,
  UpdateTrainingEvaluationHandler,
  DeleteTrainingEvaluationHandler
];
const QueryHandlers = [GetAllTrainingEvaluationHandler, GetByIdTrainingEvaluationHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [TrainingEvaluationController],
  providers: [TrainingEvaluationProjection, ...CommandHandlers, ...QueryHandlers]
})
export class TrainingEvaluationModule {}
