import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";

// Core modules
import { AuthModule } from "./auth/auth.module";
import { ProfileModule } from "./profile/profile.module";
import { GroupModule } from "./group/group.module";

/**
 * Core Container Module
 *
 * Agrupa módulos centrales de la aplicación:
 * - AuthModule (autenticación y autorización)
 * - ProfileModule (perfiles de usuario)
 * - GroupModule (gestión de grupos)
 *
 * Este contenedor centraliza la lógica de identidad y permisos,
 * reduciendo dependencias directas en AppModule.
 */
@Module({
  imports: [
    AuthModule,
    ProfileModule,
    GroupModule,
    RouterModule.register([
      {
        path: "auth",
        module: AuthModule
      },
      {
        path: "profile",
        module: ProfileModule
      },
      {
        path: "group",
        module: GroupModule
      }
    ])
  ],
  exports: [AuthModule, ProfileModule, GroupModule]
})
export class CoreContainerModule {}
