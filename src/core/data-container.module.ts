import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";

// Data modules
import { AppendixModule } from "./appendix/appendix.module";
import { SurveyDataModule } from "./surveyData/surveyData.module";

/**
 * Data Container Module
 *
 * Agrupa módulos relacionados con gestión de datos:
 * - AppendixModule (anexos/apéndices)
 * - SurveyDataModule (datos de encuestas)
 *
 * Este contenedor centraliza funcionalidades de datos,
 * facilitando la escalabilidad futura con más módulos
 * de gestión de información.
 */
@Module({
  imports: [
    AppendixModule,
    SurveyDataModule,
    RouterModule.register([
      {
        path: "appendix",
        module: AppendixModule
      },
      {
        path: "surveyData",
        module: SurveyDataModule
      }
    ])
  ],
  exports: [AppendixModule, SurveyDataModule]
})
export class DataContainerModule {}
