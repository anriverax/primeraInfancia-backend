import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllMenuPermissionQuery } from "../queries/getAll-menuPermission.query";
import { IMenuPermission, IUserMenuPermissionRes } from "../dto/menuPermission.type";
import { IUserRepository } from "@/api/auth/domain/ports/persistence/user.repository.port";
import { Inject } from "@nestjs/common";
import { buildUserMenuTree } from "../../infrastructure/utils/buildMenuTree.utils";

@QueryHandler(GetAllMenuPermissionQuery)
export class GetAllMenuPermissionHandler implements IQueryHandler<GetAllMenuPermissionQuery> {
  constructor(@Inject("IUserRepository") private readonly userRepository: IUserRepository) {}
  async execute(query: GetAllMenuPermissionQuery): Promise<IMenuPermission[] | []> {
    const { userId } = query;

    const userWithPermissions = await this.userRepository.findUnique<IUserMenuPermissionRes>({
      where: { id: userId },
      select: {
        Role: {
          select: {
            Permissions: {
              select: {
                Permission: {
                  select: {
                    id: true,
                    name: true,
                    MenuItems: {
                      select: {
                        Menu: {
                          select: {
                            id: true,
                            title: true,
                            path: true,
                            icon: true,
                            order: true,
                            parentId: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!userWithPermissions) {
      return [];
    }

    const menuWithPermissions = buildUserMenuTree(userWithPermissions.Role.Permissions);
    return menuWithPermissions;
  }
}
