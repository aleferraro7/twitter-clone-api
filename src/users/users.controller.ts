import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO, UserDTO } from './user.dto';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '.';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { CurrentUser, PublicAccess, RolesAccess } from 'src/auth/decorators';
import { ROLES } from 'src/constants';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@RolesAccess(ROLES.USER)
@ApiTags('USERS')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @PublicAccess()
  @Post()
  async create(@Body() createUserDto: UserDTO) {
    this.logger.log('Registrando usuario...');
    return this.usersService.register(createUserDto);
  }

  @PublicAccess()
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(@CurrentUser() user: User, @Paginate() query: PaginateQuery) {
    console.log({ user });
    return this.usersService.findAll(query);
  }

  @PublicAccess()
  @Get(':id')
  async findOneById(@CurrentUser() user: User, @Param('id') id: number) {
    try {
      return await this.usersService.findOneById(id);
    } catch {
      this.logger.error('Not found user'), UsersController.name;
    }
  }

  @RolesAccess(ROLES.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDTO) {
    return await this.usersService.update(id, updateUserDto);
  }

  @RolesAccess(ROLES.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.usersService.deleteById(id);
  }
}
