import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Permission, hasPermission } from '../permissions';
import { Role } from '@prisma/client';
import type { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: Role;
  };
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user?.role) {
      throw new ForbiddenException('No user role found');
    }

    const allowed = requiredPermissions.every((perm) =>
      hasPermission(user.role, perm),
    );

    if (!allowed) {
      throw new ForbiddenException(
        `User with role ${user.role} lacks required permissions`,
      );
    }

    return true;
  }
}
