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
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: Role;
  };
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    // Try DB-driven permissions first; fallback to static mapping if table not found or empty
    let allowed = false;
    try {
      const rows: Array<{ permission: string }> = await this.prisma.$queryRaw(
        Prisma.sql`SELECT permission FROM "RolePermission" WHERE role = ${user.role}`,
      );
      if (rows && rows.length > 0) {
        const dbPerms = new Set(rows.map((r) => r.permission));
        allowed = requiredPermissions.every((perm) =>
          dbPerms.has(String(perm)),
        );
      } else {
        // No DB rows – fallback to static mapping
        allowed = requiredPermissions.every((perm) =>
          hasPermission(user.role, perm),
        );
      }
    } catch {
      // Likely table doesn't exist yet (no migration). Fallback to static mapping.
      allowed = requiredPermissions.every((perm) =>
        hasPermission(user.role, perm),
      );
    }

    if (!allowed) {
      throw new ForbiddenException(
        `User with role ${user.role} lacks required permissions`,
      );
    }

    return true;
  }
}
