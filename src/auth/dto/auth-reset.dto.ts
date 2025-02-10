import { IsJWT, IsStrongPassword } from "class-validator";

export class AuthResetDTO {

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  }, { message: 'A senha não é forte o suficiente' })
  password: string;

  @IsJWT({ message: 'Deve ser um token JWT' })
  token: string
}