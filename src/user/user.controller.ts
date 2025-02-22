import {
  Controller,
  Get,
  Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../emuns/role.emun';
import { RoleGuard } from '../auth/guards/role.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { stat } from 'fs';

@UseGuards(AuthGuard, RoleGuard)
//@UseInterceptors(LogInterceptor) //Usando interceptor localmente só nesta controller
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
 
  @Roles(Role.ADMIN, Role.USER)
  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  findAll() {
    return this.userService.findAll();
  }

  
  @Get(':id')
  @ApiOperation({
    summary: 'Obter um usuário pelo ID',
    description: 'Se o usuário existir o endpont retorna um usuário pelo ID',
  })
  @ApiParam({ name: 'id', type: Number, required: true, description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    example: {
      id: 1,
      name: 'Luciana',
      email: 'lu25@gmail.com',
      password: 'suasenhaforte',
      role: 1,
      createdAt: '2023-08-01T00:00:00.000Z',
      updatedAt: '2023-08-01T00:00:00.000Z'
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    example: {
      message: 'O usuário 2 não existe',
      error: 'Not Found',
      statusCode: 404
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não está autorizado para visualizar esse recurso',
    example: {
      message: 'Forbidden resource',
      error: 'Forbidden',
      statusCode: 403
    }
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
