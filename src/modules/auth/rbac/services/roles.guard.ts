import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { UserAuthService } from "../../service/user-auth.service";
import { AdminAuthService } from "../../service/admin-auth.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userAuthService: UserAuthService,
    private adminAuthService: AdminAuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      "roles",
      context.getHandler()
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ForbiddenException("Please log in to your account!");
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });

      if (decoded.type === "admin") {
        const adminRoles =
          await this.adminAuthService.getAdminRolesFromToken(token);

        const hasRole = (roles: string[]) =>
          roles.some((role) => requiredRoles.includes(role));
        if (!hasRole(adminRoles)) {
          throw new ForbiddenException("You do not have the required role");
        }
      } else if (decoded.type === "user") {
        const userRoles =
          await this.userAuthService.getUserRolesFromToken(token);

        const hasRole = (roles: string[]) =>
          roles.some((role) => requiredRoles.includes(role));
        if (!hasRole(userRoles)) {
          throw new ForbiddenException("You do not have the required role");
        }
      } else {
        throw new ForbiddenException("Invalid token type");
      }
    } catch (error) {
      throw new ForbiddenException("You do not have the required role");
    }

    return true;
  }
}
