import { Controller, Get, Req } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { IMenuItemResponse, IMenuItems, IRolePermission } from "./dto/catalogue.type";
import { MenuItem } from "@prisma/client";
import { AuthRequired } from "@/common/decorators/authRequired.decorator";
import { GetAllRolePermissionQuery } from "./query/permission-findMany/getAllRolePermission.query";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("menu")
@ApiBearerAuth()
@Controller()
export class CatalogueController {
  constructor(private readonly queryBus: QueryBus) {}

  @AuthRequired()
  @Get("menuItems")
  @ApiOkResponse({ description: "Lista de items para el menú." })
  async getMenu(@Req() req: Request): Promise<IMenuItemResponse[] | null> {
    const userWithPermissions = await this.queryBus.execute(
      new GetAllRolePermissionQuery(req["user"].sub)
    );

    const permissions = userWithPermissions!.Role.Permissions;

    const flatMenuItems: MenuItem[] = permissions.flatMap(
      (p: IRolePermission) => p.Permission?.MenuItems.map((m: IMenuItems) => m.Menu) ?? []
    );

    // Eliminar duplicados por id
    const uniqueMenuItems: MenuItem[] = Array.from(
      new Map(flatMenuItems.map((item: MenuItem) => [item!.id, item])).values()
    );

    function buildMenuTree(items: MenuItem[], parentId: number | null = null): IMenuItemResponse[] | [] {
      return items
        .filter((item: MenuItem) => item!.parentId === parentId)
        .map((item: MenuItem) => ({
          ...item,
          children: buildMenuTree(items, item.id)
        }));
    }

    const menuTree = uniqueMenuItems.length > 0 ? buildMenuTree(uniqueMenuItems) : null;

    return menuTree;
  }
}
