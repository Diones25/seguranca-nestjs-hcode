import { IsEmail } from "class-validator";

export class AuthForgetDTO {

  @IsEmail({}, { message: 'Deve ser um email válido' })
  email: string;
}