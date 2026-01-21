import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";

// Catalogue modules
import { CatalogueModule } from "./common/catalogue.module";
import { DepartmentModule } from "./department/department.module";
import { ZoneModule } from "./zone/zone.module";
import { TrainingModule } from "./trainingModule/trainingModule.module";
import { EvaluationInstrumentModule } from "./evaluationInstrument/evaluationInstrument.module";
import { SchoolModule } from "./school/school.module";
import { TechsupportModule } from "../test/techsupport/techsupport.module";

/**
 * Catalogue Container Module
 *
 * Agrupa todos los módulos relacionados con catálogos:
 * - CatalogueModule (coordinador principal)
 * - DepartmentModule (departamentos)
 * - ZoneModule (zonas)
 * - TrainingModule (módulos de entrenamiento)
 * - EvaluationInstrumentModule (instrumentos de evaluación)
 * - SchoolModule (escuelas)
 * - TechsupportModule (cargar datos)
 *
 * Este contenedor reduce el acoplamiento en AppModule y facilita
 * el mantenimiento de funcionalidades relacionadas.
 */
@Module({
  imports: [
    CatalogueModule,
    DepartmentModule,
    ZoneModule,
    TrainingModule,
    EvaluationInstrumentModule,
    SchoolModule,
    TechsupportModule,
    RouterModule.register([
      {
        path: "catalogue",
        module: CatalogueModule,
        children: [
          {
            path: "cargar-data",
            module: TechsupportModule
          },
          {
            path: "department",
            module: DepartmentModule
          },
          {
            path: "zone",
            module: ZoneModule
          },
          {
            path: "trainingModule",
            module: TrainingModule
          },
          {
            path: "evaluationInstrument",
            module: EvaluationInstrumentModule
          },
          {
            path: "school",
            module: SchoolModule
          }
        ]
      }
    ])
  ],
  exports: [
    CatalogueModule,
    DepartmentModule,
    ZoneModule,
    TrainingModule,
    EvaluationInstrumentModule,
    SchoolModule,
    TechsupportModule
  ]
})
export class CatalogueContainerModule {}
