import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllModuleEvaluationHandler } from "./cqrs/queries/findMany/getAllModuleEvaluation.handler";
import { ModuleEvaluationProjection } from "./cqrs/projections/moduleEvaluation.projection";
import { ModuleEvaluationController } from "./moduleEvaluation.controller";
import { CreateModuleEvaluationHandler } from "./cqrs/commands/create/createModuleEvaluation.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdModuleEvaluationHandler } from "./cqrs/queries/findUnique/getByIdModuleEvaluation.handler";
import { DeleteModuleEvaluationHandler } from "./cqrs/commands/delete/deleteModuleEvaluation.handler";
import { UpdateModuleEvaluationHandler } from "./cqrs/commands/update/updateModuleEvaluation.handler";

const CommandHandlers = [
  CreateModuleEvaluationHandler,
  UpdateModuleEvaluationHandler,
  DeleteModuleEvaluationHandler
];
const QueryHandlers = [GetAllModuleEvaluationHandler, GetByIdModuleEvaluationHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [ModuleEvaluationController],
  providers: [ModuleEvaluationProjection, ...CommandHandlers, ...QueryHandlers]
})
export class ModuleEvaluationModule {}
