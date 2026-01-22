import { Module } from "@nestjs/common";

// Data modules
import { AppendixModule } from "./appendix/appendix.module";
import { SurveyDataModule } from "./surveyData/surveyData.module";

@Module({
  imports: [AppendixModule, SurveyDataModule],
  exports: [AppendixModule, SurveyDataModule]
})
export class DataContainerModule {}
