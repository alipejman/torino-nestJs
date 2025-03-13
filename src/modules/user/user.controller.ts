import { Body, Controller, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { CreatePersonalInfoDto } from "./dto/profile.dto";
import { RolesGuard } from "../auth/rbac/services/roles.guard";
import { Roles } from "../auth/rbac/decorators/role.decorator";
import { UserAuth } from "../auth/decorators/auth.decorator";
import { FormType } from "src/common/enums/form-type.enum";

@Controller("user")
@ApiTags("User_Profile")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put("/personal-info")
  @UsePipes(new ValidationPipe({transform: true}))
  @ApiBearerAuth("Authorization")
  @UserAuth()
  @ApiConsumes(FormType.UrlEncoded, FormType.Json)
  addPersonalInfo(@Body() createPersonalINfoDto: CreatePersonalInfoDto) {
    console.log(createPersonalINfoDto.nationalCode);
    return this.userService.addPersonalInfo(createPersonalINfoDto);
  }
}
