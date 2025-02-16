import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { MailerService } from "@nestjs-modules/mailer/dist";

@Injectable()
export class AuthService {

  private audience = "users";
  private issuer = "login";
  
  constructor(
    private readonly JwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly mailer: MailerService
  ) { }
  
  createToken(user: User) {
    return {
      accessToken: this.JwtService.sign({
        id: user.id,
        name: user.name,
        email: user.email
      }, {
        expiresIn: "7d",
        subject: user.id.toString(),
        issuer: this.issuer,
        audience: this.audience
      })
    }
  }

  checkToken(token: string) {
    try {
      const data = this.JwtService.verify(token, {
        audience: this.audience,
        issuer: this.issuer
      });

      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  async login(email: string, password: string) {

    const user = await this.prisma.user.findFirst({
      where: {
        email
      }
    });

    if (!user) {
      throw new UnauthorizedException("E-mail e/ou senha inválidos");
    }

    const IsPasswordValid = await bcrypt.compare(password, user.password);

    if (!IsPasswordValid) { 
      throw new UnauthorizedException("E-mail e/ou senha inválidos");
    }

    return this.createToken(user);
  } 

  async forget(email: string) {

    const user = await this.prisma.user.findFirst({
      where: {
        email
      }
    });

    if (!user) {
      throw new UnauthorizedException("E-mail é inválido");
    }

    const token = this.JwtService.sign({
      id: user.id
    }, {
      expiresIn: "30 minutes",
      subject: user.id.toString(),
      issuer: 'forget',
      audience: 'user'
    });

    //Todo: Enviar e-mail
    await this.mailer.sendMail({
      to: "diones@gmail.com",
      subject: "Recuperação de senha",
      template: "./forget",
      context: {
        name: user.name,
        token
      }
    })

    return true;
  }

  async reset(password: string, token: string) {

    //Todo: Validar token

    const id = 0;

    const user = await this.prisma.user.update({
      where: {
        id
      },
      data: {
        password
      }
    });

    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.createToken(user);
  }
}