import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import {
  IAuthRolePermission,
  IUserWithPermissions,
  IUserWithPermissionsResponse
} from "@/api/auth/application/dto/auth.type";
import { FindUniqueRolByEmailQuery } from "../queries/findUnique-rol-byEmail.query";
import { IUserRepository } from "../../domain/ports/persistence/user.repository.port";
import { Inject } from "@nestjs/common";

@QueryHandler(FindUniqueRolByEmailQuery)
export class FindUniqueRolByEmailHandler implements IQueryHandler<FindUniqueRolByEmailQuery> {
  constructor(@Inject("IUserRepository") private readonly userModel: IUserRepository) {}

  async execute(query: FindUniqueRolByEmailQuery): Promise<IUserWithPermissionsResponse | null> {
    let user: IUserWithPermissions | null = null;

    const data = {
      where: { email: query.email },
      select: {
        id: true,
        email: true,
        passwd: true,
        isVerified: true,
        Role: {
          select: {
            id: true,
            name: true,
            Permissions: { select: { Permission: { select: { name: true } } } }
          }
        }
      }
    };

    user = await this.userModel.findUnique<IUserWithPermissions>(data);

    if (user) {
      const result = user.Role.Permissions.map((p: IAuthRolePermission) => {
        if (!p.Permission) return null;

        return p.Permission.name;
      }).filter(Boolean) as string[];

      return { ...user, Role: { ...user.Role, Permissions: result } };
    }

    return null;
  }
}
