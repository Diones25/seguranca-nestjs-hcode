import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private readonly authService: AuthService) {}
  
  canActivate(context: ExecutionContext): boolean {

    const requrest = context.switchToHttp().getRequest();
    const { authorization } = requrest.headers;


    try {
      const data = this.authService.checkToken((authorization ?? '').split(' ')[1]);
      requrest.tokenPayload = data;


      return true
    } catch (error) {
      return false;
    }
  }
}