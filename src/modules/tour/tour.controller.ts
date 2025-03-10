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
  UploadedFiles,
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
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { Roles } from "../auth/rbac/decorators/role.decorator";
import { FilesInterceptor } from "@nestjs/platform-express";
import { SKipAuth } from "../auth/decorators/skippedAuth.decorator";

@ApiTags("Tours")
@Controller("tour")
@ApiBearerAuth("Authorization")
@UseGuards(RolesGuard)
@AdminAuth()
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @Roles("admin")
  @Post("/post-tour")
  @UseInterceptors(FilesInterceptor('images', 3)) 
  @ApiConsumes('multipart/form-data')
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() createTourDto: CreateTourDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" }),
        ],
      })
    )
    images: Express.Multer.File[],
  ) {
    try {
      const tour = await this.tourService.create(createTourDto, images);
      return {
        message: "تور با موفقیت ایجاد شد ✅",
        tour,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @SKipAuth()
  @Get()
  @Pagination()
  findAll(@Query() pagination: PaginationDto) {
    return this.tourService.findAll(pagination);
  }

  @SKipAuth()
  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.tourService.findOne(+id);
  }

  @SKipAuth()
  @Get("find-by-slug/:slug")
  findOneBySlug(@Param("slug") slug:string) {
    return this.tourService.findOneBySlug(slug)
  }

@Roles("admin")
@Patch("/update-tour/:id")
@UseInterceptors(FilesInterceptor('images', 3))
@ApiConsumes('multipart/form-data')
@UsePipes(new ValidationPipe({ transform: true }))
async update(
  @Param('id') id: number,
  @Body() updateTourDto: UpdateTourDto,
  @UploadedFiles(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
        new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" }),
      ],
      fileIsRequired: false, 
    })
  )
  images: Express.Multer.File[],
) {
  try {
    const updatedTour = await this.tourService.update(id, updateTourDto, images);
    return {
      message: "تور با موفقیت به‌روزرسانی شد ✅",
      updatedTour,
    };
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}

  @Roles("admin")
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: string) {
    return this.tourService.remove(+id);
  }
}
