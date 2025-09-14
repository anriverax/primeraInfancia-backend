import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TrainingModuleController } from "./trainingModule.controller";
import { JwtModule } from "@nestjs/jwt";
import { GetAllTrainingModuleHandler } from "./crqs/queries/findMany/getAllTrainingModule.handler";

const QueryHandlers = [GetAllTrainingModuleHandler];

@Module({
  imports: [CqrsModule, JwtModule],
  controllers: [TrainingModuleController],
  providers: [...QueryHandlers]
})
export class TrainingModule {}
