import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CrudController } from '../../common/crud/crud.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
export class UsersController extends CrudController<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(private readonly usersService: UsersService) {
    super(usersService);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiQuery({ name: 'email', description: 'User email', type: String })
  @ApiOkResponse({ description: 'Returns the user with the specified email.' })
  async findByEmail(@Query('email') email: string) {
    return await this.usersService.findByEmail(email);
  }
}
