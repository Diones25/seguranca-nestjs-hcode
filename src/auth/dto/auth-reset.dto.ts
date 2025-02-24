import { ApiProperty } from "@nestjs/swagger";
import { IsJWT, IsStrongPassword } from "class-validator";

export class AuthResetDTO {

  @ApiProperty({ example: '123456', description: 'Senha do usuário' })
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  }, { message: 'A senha não é forte o suficiente' })
  password: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ikx1Y2lhbmEiLCJlbWFpbCI6Imx1MjVAZ21haWwuY29tIiwiaWF0IjoxNzQwMzUwOTAwLCJleHAiOjE3NDA5NTU3MDAsImF1ZCI6InVzZXJzIiwiaXNzIjoibG9naW4iLCJzdWIiOiIxIn0.XCrRHo0CN0IvrKEQF-oAjqvSiM0MPf6yvPG16lFQHFs', description: 'Token JWT' })
  @IsJWT({ message: 'Deve ser um token JWT' })
  token: string
}