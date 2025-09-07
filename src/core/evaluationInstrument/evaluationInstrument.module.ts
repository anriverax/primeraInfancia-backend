import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllEvaluationInstrumentHandler } from "./cqrs/queries/findMany/getAllEvaluationInstrument.handler";
import { EvaluationInstrumentProjection } from "./cqrs/projections/evaluationInstrument.projection";
import { EvaluationInstrumentController } from "./evaluationInstrument.controller";
import { CreateEvaluationInstrumentHandler } from "./cqrs/commands/create/createEvaluationInstrument.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdEvaluationInstrumentHandler } from "./cqrs/queries/findUnique/getByIdEvaluationInstrument.handler";
import { DeleteEvaluationInstrumentHandler } from "./cqrs/commands/delete/deleteEvaluationInstrument.handler";
import { UpdateEvaluationInstrumentHandler } from "./cqrs/commands/update/updateEvaluationInstrument.handler";

const CommandHandlers = [
  CreateEvaluationInstrumentHandler,
  UpdateEvaluationInstrumentHandler,
  DeleteEvaluationInstrumentHandler
];
const QueryHandlers = [GetAllEvaluationInstrumentHandler, GetByIdEvaluationInstrumentHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [EvaluationInstrumentController],
  providers: [EvaluationInstrumentProjection, ...CommandHandlers, ...QueryHandlers]
})
export class EvaluationInstrumentModule {}
