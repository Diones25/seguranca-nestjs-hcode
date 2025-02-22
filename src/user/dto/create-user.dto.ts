import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { Role } from "src/emuns/role.emun";

export class CreateUserDto {

  @ApiProperty({ example: 'Luciana', description: 'Nome do usuário' })
  @IsString({ message: 'Deve ser uma string' })
  name: string;

  @ApiProperty({ example: 'luciana@gmail.com', description: 'E-mail do usuário' })
  @IsEmail({}, { message: 'Deve ser um email válido' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Senha do usuário' })
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  }, { message: 'A senha não é forte o suficiente' })
  password: string;

  @ApiProperty({ example: 1, description: 'Role do usuário' })
  @IsOptional()
  @IsEnum(Role)
  role: number;
}
