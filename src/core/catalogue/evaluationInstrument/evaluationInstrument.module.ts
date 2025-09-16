import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { EvaluationInstrumentController } from "./evaluationInstrument.controller";
import { JwtModule } from "@nestjs/jwt";
import { GetAllEvaluationInstrumentHandler } from "./crqs/queries/findMany/getAllEvaluationInstrument.handler";

const QueryHandlers = [GetAllEvaluationInstrumentHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [EvaluationInstrumentController],
  providers: [...QueryHandlers]
})
export class EvaluationInstrumentModule {}
