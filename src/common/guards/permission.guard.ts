import { PrismaService } from "@/services/prisma/prisma.service";
import { CanActivate, ExecutionContext, Injectable, ForbiddenException, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEY } from "../decorators/permission.decorator";
import { TypePermission } from "@prisma/client";

@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name);
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    const permission = this.reflector.get<{ menu: string; action: TypePermission }>(
      PERMISSION_KEY,
      context.getHandler()
    );

    if (!permission) return true;

    try {
      const hasPermission = await this.prisma.rolePermission.findFirst({
        where: {
          roleId: user.roleId,
          isActive: true,
          MenuPermission: {
            Menu: { path: permission.menu },
            PermissionType: { name: permission.action }
          }
        }
      });

      if (!hasPermission) {
        this.logger.error("No tienes permiso para esta acción.");
        throw new ForbiddenException("No tienes permiso para esta acción.");
      }
      return true;
    } catch (error) {
      this.logger.error("No se pudo validar el token de acceso.", error);
      throw new ForbiddenException("No tienes permiso para acceder a este recurso.");
    }
  }
}
