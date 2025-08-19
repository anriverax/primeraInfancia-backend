import { CommandHandler } from "@nestjs/cqrs";
import { NestResponse } from "@/common/helpers/types";
import { AddRolePermissionCommand } from "./addRolePermission.command";
import { MenuPermissionProjection } from "../../projections/menuPermission.projection";

@CommandHandler(AddRolePermissionCommand)
export class AddRolePermissionHandler {
  constructor(private menuPermissionProjection: MenuPermissionProjection) {}

  async execute(command: AddRolePermissionCommand): Promise<NestResponse<void>> {
    const { data } = command;

    for (const d of data) {
      await this.menuPermissionProjection.addAdminPermission(1, d.id);
    }

    return {
      statusCode: 201,
      message: "Los roles han sido asignado a los permisos de cada menu."
    };
  }
}
