import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllSurveyDataHandler } from "./cqrs/queries/findMany/getAllSurveyData.handler";
import { SurveyDataProjection } from "./cqrs/projections/surveyData.projection";
import { SurveyDataController } from "./surveyData.controller";
import { CreateSurveyDataHandler } from "./cqrs/commands/create/createSurveyData.command";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdSurveyDataHandler } from "./cqrs/queries/findUnique/getByIdSurveyData.handler";
import { GetByInscriptionSurveyDataHandler } from "./cqrs/queries/findMany/getByInscriptionSurveyData.handler";
import { DeleteSurveyDataHandler } from "./cqrs/commands/delete/deleteSurveyData.handler";
import { UpdateSurveyDataHandler } from "./cqrs/commands/update/updateSurveyData.handler";

const CommandHandlers = [CreateSurveyDataHandler, UpdateSurveyDataHandler, DeleteSurveyDataHandler];
const QueryHandlers = [GetAllSurveyDataHandler, GetByIdSurveyDataHandler, GetByInscriptionSurveyDataHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [SurveyDataController],
  providers: [SurveyDataProjection, ...CommandHandlers, ...QueryHandlers]
})
export class SurveyDataModule {}
