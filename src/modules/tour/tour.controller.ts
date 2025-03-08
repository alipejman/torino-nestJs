import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { TourService } from "./tour.service";
import { CreateTourDto } from "./dto/create-tour.dto";
import { UpdateTourDto } from "./dto/update-tour.dto";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { FormType } from "src/common/enums/form-type.enum";
import { uploadFileS3 } from "src/common/interceptors/upload-file.interceptor";
import { RolesGuard } from "../auth/rbac/services/roles.guard";
import { AdminAuth } from "../auth/decorators/adminAuth.decorator";
import { SkipAuth } from "src/common/decorators/skip-auth.decorator";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { Roles } from "../auth/rbac/decorators/role.decorator";

@ApiTags("Tours")
@Controller("tour")
@ApiBearerAuth("Authorization")
@UseGuards(RolesGuard)
@AdminAuth()
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Roles("admin")
  @Post("/post-tour")
  @UseInterceptors(uploadFileS3("image"))
  @ApiConsumes(FormType.Multipart)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() createTourDto: CreateTourDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" }),
        ],
      })
    )
    image: Express.Multer.File
  ) {
    try {
      const tour = await this.tourService.create(createTourDto, image);
      return {
        message: "تور با موفقیت ایجاد شد ✅",
        tour,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @SkipAuth()
  @Get()
  @Pagination()
  findAll(@Query() pagination: PaginationDto) {
    return this.tourService.findAll(pagination);
  }

  @SkipAuth()
  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.tourService.findOne(+id);
  }

  @SkipAuth()
  @Get("find-by-slug/:slug")
  findOneBySlug(@Param("slug") slug:string) {
    return this.tourService.findOneBySlug(slug)
  }

  @Roles("admin")
  @Patch(":id")
  @UseInterceptors(uploadFileS3("image"))
  @ApiConsumes(FormType.Multipart)
  update(@Param("id") id: number, @Body() updateTourDto: UpdateTourDto, 
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({maxSize: 10 * 1024 * 1024}),
        new FileTypeValidator({fileType: "image/(png|jpg|jpeg|webp)"})
      ]
    })
  )
  image: Express.Multer.File
) {
    return this.tourService.update(+id, updateTourDto, image);
  }

  @Roles("admin")
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: string) {
    return this.tourService.remove(+id);
  }
}
