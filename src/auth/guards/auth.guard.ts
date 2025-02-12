import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }
  
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const requrest = context.switchToHttp().getRequest();
    const { authorization } = requrest.headers;


    try {
      const data = this.authService.checkToken((authorization ?? '').split(' ')[1]);
      requrest.tokenPayload = data;

      requrest.user = await this.userService.findOne(data.id);


      return true
    } catch (error) {
      return false;
    }
  }
}