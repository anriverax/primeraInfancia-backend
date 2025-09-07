import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllTrainingReportHandler } from "./cqrs/queries/findMany/getAllTrainingReport.handler";
import { TrainingReportProjection } from "./cqrs/projections/trainingReport.projection";
import { TrainingReportController } from "./trainingReport.controller";
import { CreateTrainingReportHandler } from "./cqrs/commands/create/createTrainingReport.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdTrainingReportHandler } from "./cqrs/queries/findUnique/getByIdTrainingReport.handler";
import { DeleteTrainingReportHandler } from "./cqrs/commands/delete/deleteTrainingReport.handler";
import { UpdateTrainingReportHandler } from "./cqrs/commands/update/updateTrainingReport.handler";

const CommandHandlers = [
  CreateTrainingReportHandler,
  UpdateTrainingReportHandler,
  DeleteTrainingReportHandler
];
const QueryHandlers = [GetAllTrainingReportHandler, GetByIdTrainingReportHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [TrainingReportController],
  providers: [TrainingReportProjection, ...CommandHandlers, ...QueryHandlers]
})
export class TrainingReportModule {}
