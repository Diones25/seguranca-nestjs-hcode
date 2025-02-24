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
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthGuard, RoleGuard)
//@UseInterceptors(LogInterceptor) //Usando interceptor localmente só nesta controller
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@Roles(Role.ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Criar um usuário',  
    description: 'Endpoint responsável por criar um novo usuário no sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    example: {
      id: 2,
      name: "Jão",
      email: "jonas371@gmail.com",
      password: "$2b$10$nw8e.8/t9QIwkWk2P7iLfel7K1uuVWwGTGPGGQlNuEoZttpdWTqtq",
      role: 1,
      createdAt: "2025-02-24T01:33:24.000Z",
      updatedAt: "2025-02-24T01:33:24.000Z"
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação do body',
    example: {
      message: [
        'Deve ser um email válido',
        'A senha não é forte o suficiente'
      ],
      error: 'Bad Request',
      statusCode: 400
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Email já existe',
    example: {
      message: 'Email já existe',
      error: 'Bad Request',
      statusCode: 400
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
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
 
  @Roles(Role.ADMIN, Role.USER)
  @Get()
  @ApiOperation({
    summary: 'Listar todos os usuários',
    description: 'Retorna uma lista de todos os usuários cadastrados no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    example: [
      {
        id: 1,
        name: 'Luciana',
        email: 'lu25@gmail.com',
        password: 'suasenhaforte',
        role: 1,
        createdAt: '2023-08-01T00:00:00.000Z',
        updatedAt: '2023-08-01T00:00:00.000Z'
      },
      {
        id: 2,
        name: 'Lucas',
        email: 'lucassilva@gmail.com',
        password: 'suasenhaforte2',
        role: 2,
        createdAt: '2023-08-01T00:00:00.000Z',
        updatedAt: '2023-08-01T00:00:00.000Z'
      },
      {
        id: 3,
        name: 'Maria',
        email: 'ma2545@gmail.com',
        password: 'suasenhaforte3',
        role: 1,
        createdAt: '2023-08-01T00:00:00.000Z',
        updatedAt: '2023-08-01T00:00:00.000Z'
      }
    ]
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
  findAll() {
    return this.userService.findAll();
  }

  
  @Get(':id')
  @ApiBearerAuth('JWT-auth') // Adiciona o ícone de cadeado no Swagger
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

  //@Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar um usuário pelo ID',
    description: 'Se o usuário existir o endpont atualiza um usuário pelo ID',
  })
  @ApiParam({ name: 'id', type: Number, required: true, description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário criado com sucesso',
    example: {
      id: 2,
      name: "Jão",
      email: "jonas371@gmail.com",
      password: "$2b$10$nw8e.8/t9QIwkWk2P7iLfel7K1uuVWwGTGPGGQlNuEoZttpdWTqtq",
      role: 1,
      createdAt: "2025-02-24T01:33:24.000Z",
      updatedAt: "2025-02-24T01:33:24.000Z"
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação do body',
    example: {
      message: [
        'Deve ser um email válido',
        'A senha não é forte o suficiente'
      ],
      error: 'Bad Request',
      statusCode: 400
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    example: {
      message: 'O usuário 30 não existe',
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
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  //@Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar um usuário pelo ID',
    description: 'Se o usuário existir o endpont deleta um usuário pelo ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário deletado com sucesso',
    example: {
      success: true
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    example: {
      message: 'O usuário 10 não existe',
      error: 'Not Found',
      statusCode: 404
    }
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
