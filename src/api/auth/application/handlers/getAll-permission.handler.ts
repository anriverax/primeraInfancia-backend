import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllPermissionQuery } from "../queries/getAll-permission.query";
import {
  IMenuPermissionRepository,
  IMenuPermissionResponse
} from "../../../catalogue/menuPermission/domain/menuPermission.repository.port";
import { Inject } from "@nestjs/common";

@QueryHandler(GetAllPermissionQuery)
export class GetAllPermissionHandler implements IQueryHandler<GetAllPermissionQuery> {
  constructor(
    @Inject("IMenuPermissionRepository")
    private readonly menuPermissionRepository: IMenuPermissionRepository
  ) {}

  async execute(): Promise<Record<string, string[]>> {
    const permissions = await this.menuPermissionRepository.findMany<IMenuPermissionResponse>({
      select: {
        Menu: { select: { path: true, order: true } },
        Permission: { select: { name: true } }
      },
      orderBy: { Menu: { order: "asc" } }
    });

    const map = permissions.reduce<Record<string, string[]>>((acc, row) => {
      const path = row.Menu.path;
      const perm = row.Permission.name;
      if (!acc[path]) acc[path] = [];
      if (!acc[path].includes(perm)) acc[path].push(perm);
      return acc;
    }, {});

    return map;
  }
}
