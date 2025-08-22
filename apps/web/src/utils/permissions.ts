import { Role } from '@prisma/client';

export enum Permission {
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_PRODUCTS = 'MANAGE_PRODUCTS',
  MANAGE_ORDERS = 'MANAGE_ORDERS',
}

const rolePermissions: Record<Role, Permission[]> = {
  [Role.USER]: [Permission.VIEW_DASHBOARD],
  [Role.ADMIN]: [
    Permission.VIEW_DASHBOARD,
    Permission.MANAGE_USERS,
    Permission.MANAGE_PRODUCTS,
    Permission.MANAGE_ORDERS,
  ],
};

export const hasPermission = (role: Role | undefined | null, permission: Permission): boolean => {
  if (!role) return false;
  const perms = rolePermissions[role] ?? [];
  return perms.includes(permission);
};
