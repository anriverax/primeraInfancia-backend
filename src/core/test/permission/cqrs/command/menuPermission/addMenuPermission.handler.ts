import { CommandHandler } from "@nestjs/cqrs";
import { NestResponse } from "@/common/helpers/dto";
import { AddMenuPermissionCommand } from "./addMenuPermission.command";
import { MenuPermissionProjection } from "../../projections/menuPermission.projection";

@CommandHandler(AddMenuPermissionCommand)
export class AddMenuPermissionHandler {
  constructor(private menuPermissionProjection: MenuPermissionProjection) {}

  async execute(): Promise<NestResponse<void>> {
    await this.menuPermissionProjection.create();

    return {
      statusCode: 201,
      message: "Los permisos al menu han sido agregado exitosamente."
    };
  }
}
