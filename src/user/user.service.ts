import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) {}

  private readonly looger = new Logger(UserService.name);

  async create(createUserDto: CreateUserDto) {
    this.looger.log("Criando usuário");
    return this.prisma.user.create({ data: createUserDto });
  }

  async findAll() {
    this.looger.log("Listando vários usuários");
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    await this.exists(id);
    
    this.looger.log("Listando um usuário");
    return this.prisma.user.findUnique({
      where: {
        id
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.exists(id);

    this.looger.log("Atualizando um usuário");
    return this.prisma.user.update({
      data: updateUserDto,
      where: {
        id
      }
    });
  }

  async remove(id: number) {
    await this.exists(id);

    this.looger.log("Deletando um usuário");
    return this.prisma.user.delete({
      where: {
        id
      }
    });
  }

  async exists(id: number) {
    const user = await this.prisma.user.count({
      where: {
        id
      }
    });
    
    if (!user) {
      this.looger.log("Aconteceu uma exceção");
      throw new NotFoundException(`O usuário ${id} não existe`);
    }
  }
}
