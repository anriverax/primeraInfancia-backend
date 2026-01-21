import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";

// Test modules
import { MunicipalityModule } from "./coutry/municipality/municipality.module";
import { PermissionModule } from "./permission/permission.module";
import { TechsupportModule } from "./techsupport/techsupport.module";

/**
 * Test Container Module
 *
 * Agrupa módulos de prueba y soporte:
 * - MunicipalityModule (municipios - datos de catálogo)
 * - PermissionModule (permisos de menú y roles)
 * - TechsupportModule (soporte técnico y carga de datos)
 *
 * Nota: Los módulos en esta carpeta son principalmente para
 * desarrollo y testing. En producción, algunos pueden moverse
 * a otros contenedores cuando estén listos.
 */
@Module({
  imports: [
    MunicipalityModule,
    PermissionModule,
    TechsupportModule,
    RouterModule.register([
      {
        path: "test",
        children: [
          {
            path: "municipality",
            module: MunicipalityModule
          },
          {
            path: "permission",
            module: PermissionModule
          }
        ]
      }
    ])
  ],
  exports: [MunicipalityModule, PermissionModule, TechsupportModule]
})
export class TestContainerModule {}
