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
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User, USER_PAGINATE_CONFIG } from '.';
import { JwtAuthGuard, RolesGuard } from 'src/auth/guards';
import { CurrentUser, PublicAccess, RolesAccess } from 'src/auth/decorators';
import { ROLES } from 'src/constants';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@RolesAccess(ROLES.USER)
@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger,
  ) {}

  @PublicAccess()
  @Post()
  async create(@Body() createUserDto: UserDTO) {
    return this.usersService.register(createUserDto);
  }

  @Get()
  @ApiOkPaginatedResponse(User, USER_PAGINATE_CONFIG)
  @ApiPaginationQuery(USER_PAGINATE_CONFIG)
  @UseGuards(JwtAuthGuard)
  async getUsers(@CurrentUser() user: User, @Paginate() query: PaginateQuery) {
    console.log({ user });
    return this.usersService.findAll(query);
  }

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
