import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { BlogService } from "./blog.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AdminAuth } from "../auth/decorators/adminAuth.decorator";
import { RolesGuard } from "../auth/rbac/services/roles.guard";
import { Roles } from "../auth/rbac/decorators/role.decorator";
import { FilesInterceptor } from "@nestjs/platform-express";
import { FormType } from "src/common/enums/form-type.enum";
import { SKipAuth } from "../auth/decorators/skippedAuth.decorator";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto } from "src/common/dtos/pagination.dto";

@Controller("blog")
@ApiTags("Blog")
@ApiBearerAuth("Authorization")
@Roles("admin")
@UseGuards(RolesGuard)
@AdminAuth()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post("/post")
  @ApiConsumes(FormType.Multipart)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FilesInterceptor("images", 3))
  create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: "image/(png|jpeg|jpg|webp)" }),
        ],
      })
    )
    images: Express.Multer.File[]
  ) {
    return this.blogService.create(createBlogDto, images);
  }

  @Get()
  @SKipAuth()
  @Pagination()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.blogService.findAll(paginationDto);
  }

  @Get(":id")
  @SKipAuth()
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.findOne(+id);
  }
  @Get("get/blog-by-slug/:slug")
  @SKipAuth()
  findOneBySlug(@Param("slug") slug: string) {
    return this.blogService.findOneBySlug(slug);
  }

  @Patch(":id")
  @ApiConsumes(FormType.Multipart)
  @UseInterceptors(FilesInterceptor("images", 3))
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: "image/(png|jpeg|webp|jpg)" }),
        ],
      })
    )
    images: Express.Multer.File[]
  ) {
    return this.blogService.update(+id, updateBlogDto, images);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.blogService.remove(+id);
  }
}
