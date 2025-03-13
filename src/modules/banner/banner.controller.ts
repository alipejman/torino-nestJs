import {
  Body,
  Controller,
  Put,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
  UseGuards,
  Delete,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { BannerService } from "./banner.service";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Roles } from "../auth/rbac/decorators/role.decorator";
import { RolesGuard } from "../auth/rbac/services/roles.guard";
import { AdminAuth } from "../auth/decorators/adminAuth.decorator";

@Controller("banner")
@ApiTags("Banner")
@ApiBearerAuth("Authorization")
@Roles("admin")
@UseGuards(RolesGuard)
@AdminAuth()
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Put("set-banner")
  @UseInterceptors(FileInterceptor("image"))
  @ApiConsumes("multipart/form-data")
  async setBanner(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: "image/(jpg|jpeg|webp|png)" }),
        ],
        fileIsRequired: false,
      }),
    )
    image?: Express.Multer.File,
  ) {
    try {
      return await this.bannerService.setBanner(createBannerDto, image);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}