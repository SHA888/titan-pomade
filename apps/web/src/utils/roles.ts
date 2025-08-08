import { Role } from '@prisma/client';
import { createElement, type ComponentType, type FC } from 'react';

type UserRole = Role | string;

/**
 * Check if the user has any of the required roles
 * @param userRole The user's role
 * @param requiredRoles Roles that are allowed to access the resource
 * @returns boolean indicating if the user has any of the required roles
 */
export const hasRole = (
  userRole: UserRole | undefined | null,
  requiredRoles: UserRole[]
): boolean => {
  if (!userRole) return false;
  return requiredRoles.some((role) => userRole === role);
};

/**
 * Check if the user is an admin
 * @param userRole The user's role
 * @returns boolean indicating if the user is an admin
 */
export const isAdmin = (userRole: UserRole | undefined | null): boolean => {
  return userRole === Role.ADMIN;
};

/**
 * Higher-Order Component for role-based access control
 * @param allowedRoles Roles that are allowed to access the component
 * @param Component The component to render if the user has the required role
 * @param FallbackComponent Optional component to render if the user doesn't have the required role
 * @returns A new component that renders based on the user's role
 */
export const withRole = <P extends object>(
  allowedRoles: UserRole[],
  Component: ComponentType<P>,
  FallbackComponent?: ComponentType<P>
) => {
  const RoleProtectedComponent: FC<P & { userRole?: UserRole }> = ({ userRole, ...props }) => {
    const hasRequiredRole = hasRole(userRole, allowedRoles);

    if (hasRequiredRole) {
      return createElement(Component, props as P);
    }

    return FallbackComponent ? createElement(FallbackComponent, props as P) : null;
  };

  return RoleProtectedComponent;
};
