import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./guards/auth.guard";
import { User } from "src/decorators/user.decorator";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { join } from "node:path";
import { FileService } from "src/file/file.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('auth')
export class AuthController {

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly fileService: FileService
  ) { }

  @Post('login')
  @ApiOperation({
    summary: 'Login de usuário',
    description: 'Realiza o login de um usuário cadastrado no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário logado com sucesso',
    example: {
      accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ikx1Y2lhbmEiLCJlbWFpbCI6Imx1MjVAZ21haWwuY29tIiwiaWF0IjoxNzQwMzUwOTAwLCJleHAiOjE3NDA5NTU3MDAsImF1ZCI6InVzZXJzIiwiaXNzIjoibG9naW4iLCJzdWIiOiIxIn0.XCrRHo0CN0IvrKEQF-oAjqvSiM0MPf6yvPG16lFQHFs`
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação do body',
    example: {
      message: [
        'Deve ser um email válido',
        'A senha não é forte o suficiente'
      ],
      error: 'Bad Request',
      statusCode: 400
    }
  })
  @ApiResponse({
    status: 401,
    description: 'E-mail e/ou senha inválidos',
    example: {
      message: 'E-mail e/ou senha inválidos',
      error: 'Unauthorized',
      statusCode: 401
    }
  })
  async login(@Body() body: AuthLoginDTO) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post('forget')
  async forget(@Body() body: AuthForgetDTO) {
    return this.authService.forget(body.email);
  }

  @Post('reset')
  async reset(@Body() body: AuthResetDTO) {
    return this.authService.reset(body.password, body.token);
  }

  @UseGuards(AuthGuard)
  @Post('me') //rota para testar a validação do token
  async me(@User() user) {
    return { user };
  }

  @UseInterceptors(FileInterceptor('photo'))
  @UseGuards(AuthGuard)
  @Post('photo') 
  async uploadPhoto(
    @User() user,
    @UploadedFile(new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/jpeg' }),
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })
      ]
    })) photo: Express.Multer.File) {

    const path = join(__dirname, '../', '../', 'storage', 'photos', `photo${user.id}${photo.originalname}`);

    try {
      await this.fileService.upload(photo, path);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return { sucess: true };
  }

  @Post('files')
  @UseInterceptors(FilesInterceptor('files', 10, new FileService().getMulterOptions()))
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    try {
      return this.fileService.processUploadedFiles(files);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}