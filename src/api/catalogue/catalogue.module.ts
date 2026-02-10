import { Module } from "@nestjs/common";

import { MenuPermissionModule } from "./menuPermission/menuPermission.module";

@Module({
  imports: [MenuPermissionModule]
})
export class CatalogueModule {}
