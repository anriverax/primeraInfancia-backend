import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { GetAllTrainingModuleHandler } from "./cqrs/queries/findMany/getAllTrainingModule.handler";
import { TrainingModuleProjection } from "./cqrs/projections/trainingModule.projection";
import { TrainingModuleController } from "./trainingModule.controller";
import { CreateTrainingModuleHandler } from "./cqrs/commands/create/createTrainingModule.handler";
import { JwtModule } from "@nestjs/jwt";
import { GetByIdTrainingModuleHandler } from "./cqrs/queries/findUnique/getByIdTrainingModule.handler";
import { DeleteTrainingModuleHandler } from "./cqrs/commands/delete/deleteTrainingModule.handler";
import { UpdateTrainingModuleHandler } from "./cqrs/commands/update/updateTrainingModule.handler";

const CommandHandlers = [
  CreateTrainingModuleHandler,
  UpdateTrainingModuleHandler,
  DeleteTrainingModuleHandler
];
const QueryHandlers = [GetAllTrainingModuleHandler, GetByIdTrainingModuleHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [TrainingModuleController],
  providers: [TrainingModuleProjection, ...CommandHandlers, ...QueryHandlers]
})
export class TrainingModuleModule {}
