import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { CreatePersonalInfoDto, SetMailDto } from "./dto/profile.dto";
import { RolesGuard } from "../auth/rbac/services/roles.guard";
import { Roles } from "../auth/rbac/decorators/role.decorator";
import { UserAuth } from "../auth/decorators/auth.decorator";
import { FormType } from "src/common/enums/form-type.enum";

@Controller("user")
@ApiTags("User_Profile")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("user-profile") 
  @ApiBearerAuth("Authorization")
  @UserAuth()
  getUserProfile() {
    return this.userService.getUserProfile();
  }

  // @Get("/my-tours/:id")
  // @Roles("user")
  // @UseGuards(RolesGuard)
  // @UserAuth()
  // getUserTour(@Param("id", ParseIntPipe) id: number) {
  //   return this.userService.getUserTour(id)
  // }


  @Put("/personal-info")
  @UsePipes(new ValidationPipe({transform: true}))
  @ApiBearerAuth("Authorization")
  @UserAuth()
  @ApiConsumes(FormType.UrlEncoded, FormType.Json)
  addPersonalInfo(@Body() createPersonalINfoDto: CreatePersonalInfoDto) {
    console.log(createPersonalINfoDto.nationalCode);
    return this.userService.addPersonalInfo(createPersonalINfoDto);
  }
  @Put("/set-email")
  @UsePipes(new ValidationPipe({transform: true}))
  @ApiBearerAuth("Authorization")
  @UserAuth()
  @ApiConsumes(FormType.UrlEncoded, FormType.Json)
  setEmail(@Body() setEmailDto: SetMailDto) {
    return this.userService.setEmail(setEmailDto);
  }
}
