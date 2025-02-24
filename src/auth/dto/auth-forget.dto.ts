import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class AuthForgetDTO {

  @ApiProperty({ example: 'luciana@gmail.com', description: 'E-mail do usuário' })
  @IsEmail({}, { message: 'Deve ser um email válido' })
  email: string;
}