import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FormType } from "src/common/enums/form-type.enum";
import { UserCheckOtpDto, UserSendOtpDto } from "../dto/Authenticate.dto";
import { UserAuthService } from "../service/user-auth.service";
import { RoleEnum } from "../rbac/enum/rbac.enum";
import { Roles } from "../rbac/decorators/role.decorator";
import { RolesGuard } from "../rbac/services/roles.guard";
import { AuthGuard } from "../service/auth.guard";
import { UserAuth } from "../decorators/auth.decorator";

@Controller("user")
@ApiTags("User_Auth")
@UseGuards(RolesGuard)
export class UserAuthController {
    constructor(
        private userAuthService: UserAuthService
    ) {}

    @Post("/send-otp")
    @ApiConsumes(FormType.UrlEncoded, FormType.Json)
    sendOtp(@Body() userSendOtpDto: UserSendOtpDto) {
        return this.userAuthService.sendOtp(userSendOtpDto);
    }
    @Post("/check-otp")
    @ApiConsumes(FormType.UrlEncoded, FormType.Json)
    checkOtp(@Body() userCheckOtpDto: UserCheckOtpDto) {
        return this.userAuthService.checkOtp(userCheckOtpDto);
    }

    @Get("/hidden-files")
    @ApiBearerAuth("Authorization")
    @Roles("user")
    @UserAuth()
    getHidden() {
        return {
            message: "this is resource for users ✅"
        }
    }
}