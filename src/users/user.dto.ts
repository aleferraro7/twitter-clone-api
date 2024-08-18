import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ROLES } from 'src/constants/roles';

export class UserDTO {
  @ApiProperty({
    description: 'Username',
    example: 'John23',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'User mail',
    example: 'johndoe@mail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Phone number',
    example: '12345678',
    required: true,
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'User password',
    example: '123456',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User role',
    example: 'USER',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(ROLES)
  role: ROLES;

  @ApiProperty({
    description: 'Avatar of the user',
    default:
      'https://img.freepik.com/vector-premium/icono-avatar-masculino-persona-desconocida-o-anonima-icono-perfil-avatar-predeterminado-usuario-redes-sociales-hombre-negocios-silueta-perfil-hombre-aislado-sobre-fondo-blanco-ilustracion-vectorial_735449-122.jpg?w=360',
    required: true,
  })
  @IsNotEmpty()
  avatarUrl: string;
}

export class UpdateUserDTO extends PartialType(UserDTO) {}
