import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  CustomDecorator
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { SetMetadata } from "@nestjs/common";

export const PERMISSIONS_KEY = "permissions";
export const RequirePermissions = (...permissions: string[]): CustomDecorator<string> =>
  SetMetadata(PERMISSIONS_KEY, permissions);

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user || !user.permissions) {
      throw new ForbiddenException("No se tienes permisos suficientes");
    }

    const hasPermission = requiredPermissions.every((perm) => user.permissions.includes(perm));

    if (!hasPermission) {
      throw new ForbiddenException("No tienes permisos suficientes");
    }

    return true;
  }
}
