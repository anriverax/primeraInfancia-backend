import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "../decorators/permission.decorator";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user || !user.permissions) {
      throw new ForbiddenException("No se encontraron permisos en el usuario");
    }

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No se requieren permisos específicos
    }

    const hasPermission = requiredPermissions.some((perm) => user.permissions.includes(perm));

    if (!hasPermission) {
      throw new ForbiddenException("No tienes permisos suficientes");
    }

    return true;
  }
}
