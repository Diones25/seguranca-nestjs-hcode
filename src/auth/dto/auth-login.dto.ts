import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsStrongPassword } from "class-validator";

export class AuthLoginDTO {

  @ApiProperty({ example: 'seuemail@gmail.com', description: 'E-mail do usuário' })
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
}