import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AdminAuthService } from "./admin-auth.service";
import { SKIP_AUTH } from "../decorators/skippedAuth.decorator";
import { Request } from "express";
import { isJWT } from "class-validator";
import { Observable } from "rxjs";

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private adminAuthService: AdminAuthService
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
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    request.user = await this.adminAuthService.validateAccessToken(token);
    return true;
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
