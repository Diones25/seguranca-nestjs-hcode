import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) {}

  private readonly looger = new Logger(UserService.name);

  async create(createUserDto: CreateUserDto) {

    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email já existe');
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

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

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

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
    await this.prisma.user.delete({
      where: {
        id
      }
    });
    return { success: true };
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
