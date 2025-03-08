import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { UserAuthService } from "./user-auth.service";
import { Reflector } from "@nestjs/core";
import { SKIP_AUTH } from "../decorators/skippedAuth.decorator";
import { Request } from "express";
import { isJWT } from "class-validator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userAuthService: UserAuthService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext) {
    const isSkippedAuth = this.reflector.get<boolean>(
      SKIP_AUTH,
      context.getHandler()
    );
    if (isSkippedAuth) {
      return true;
    }
    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest<Request>();
    const token = this.extractToken(request);
    request.user = await this.userAuthService.validateAccessToken(token);
    return true
  }

  protected extractToken(request: Request) {
    const { authorization } = request.headers;
    if (!authorization || authorization?.trim() == "") {
      throw new UnauthorizedException("login your account !");
    }
    const [bearer, token] = authorization?.split(" ");
    if (bearer?.toLocaleLowerCase() !== "bearer" || !token || !isJWT(token)) {
      throw new UnauthorizedException("login your account !");
    }
    return token;
  }
}
