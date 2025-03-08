import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FormType } from "src/common/enums/form-type.enum";
import { AdminLoginDto, AdminRegisterDto } from "../dto/Authenticate.dto";
import { Request } from "express";
import { AdminAuthService } from "../service/admin-auth.service";
import { Roles } from "../rbac/decorators/role.decorator";
import { AdminAuth } from "../decorators/adminAuth.decorator";
import { RolesGuard } from "../rbac/services/roles.guard";

@Controller("admin")
@ApiTags("Admin_Auth")
@UseGuards(RolesGuard)
export class AdminAuthController {
  constructor(private adminAuthService: AdminAuthService) {}

  @Post("/register")
  @ApiConsumes(FormType.UrlEncoded, FormType.Json)
  register(@Body() adminRegisterDto: AdminRegisterDto) {
    return this.adminAuthService.register(adminRegisterDto);
  }
  @Post("/login")
  @ApiConsumes(FormType.UrlEncoded, FormType.Json)
  login(@Body() adminLoginDto: AdminLoginDto) {
    return this.adminAuthService.login(adminLoginDto);
  }

  @Get("for-admins")
  @ApiBearerAuth("Authorization")
  @Roles("admin", "accountant")
  @AdminAuth()
  forAdmins() {
    return {
      message: "this data for admins ✅",
    };
  }
}
