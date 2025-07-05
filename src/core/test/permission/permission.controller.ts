import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { NestResponse } from "@/common/helpers/dto";
import { Controller, Post, UseFilters } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AddMenuPermissionCommand } from "./cqrs/command/menuPermission/addMenuPermission.command";
import { MenuPermissionQuery } from "./cqrs/queries/menuPermission.query";
import { AddRolePermissionCommand } from "./cqrs/command/rolePermission/addRolePermission.command";

@Controller()
@UseFilters(HttpExceptionFilter)
export class PermissionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post("addMenuPermission")
  async add(): Promise<NestResponse<void>> {
    return this.commandBus.execute(new AddMenuPermissionCommand());
  }

  @Post("addAdminPermission")
  async adminPermission(): Promise<NestResponse<void>> {
    const data = await this.queryBus.execute(new MenuPermissionQuery());

    return this.commandBus.execute(new AddRolePermissionCommand(data));
  }
}
