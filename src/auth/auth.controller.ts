import {
  BadRequestException,
  Body,
  Controller,
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

@Controller('auth')
export class AuthController {

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly fileService: FileService
  ) { }

  @Post('login')
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
  async uploadPhoto(@User() user, @UploadedFile() photo: Express.Multer.File) {

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