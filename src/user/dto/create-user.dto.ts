import { IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { Role } from "src/emuns/role.emun";

export class CreateUserDto {

  @IsString({ message: 'Deve ser uma string' })
  name: string;

  @IsEmail({}, { message: 'Deve ser um email válido' })
  email: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  }, { message: 'A senha não é forte o suficiente' })
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role: number;
}
