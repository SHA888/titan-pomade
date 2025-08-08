import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/permissions';
import { Role } from '@prisma/client';
import { AdminService } from './admin.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @Roles(Role.ADMIN)
  @Permissions(Permission.VIEW_DASHBOARD)
  @ApiOperation({ summary: 'Get admin dashboard data' })
  getDashboard() {
    return {
      message: 'Welcome to the admin dashboard!',
      stats: {
        users: 42,
        products: 156,
        orders: 89,
      },
    };
  }

  @Get('users')
  @Roles(Role.ADMIN)
  @Permissions(Permission.MANAGE_USERS)
  @ApiOperation({ summary: 'Get all users' })
  async getUsers() {
    const users = await this.adminService.listUsers();
    return { users };
  }

  @Patch('users/:id/role')
  @Roles(Role.ADMIN)
  @Permissions(Permission.MANAGE_USERS)
  @ApiOperation({ summary: 'Update user role' })
  @ApiParam({ name: 'id', description: 'User ID', required: true })
  @ApiBody({ type: UpdateUserRoleDto })
  async updateUserRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    const user = await this.adminService.updateUserRole(id, dto.role);
    return { user };
  }
}
