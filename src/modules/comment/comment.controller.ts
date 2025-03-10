import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentBlogDto, CreateCommentDto } from './dto/create-comment.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { FormType } from 'src/common/enums/form-type.enum';
import { AdminAuth } from '../auth/decorators/adminAuth.decorator';
import { RolesGuard } from '../auth/rbac/services/roles.guard';
import { Roles } from '../auth/rbac/decorators/role.decorator';

@Controller('comment')
@ApiTags("Comments")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  
  @Post("/for-tour")
  @ApiBearerAuth("Authorization")
  @UserAuth()
  @ApiConsumes(FormType.UrlEncoded, FormType.Json)
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Post("/for-blog")
  @ApiBearerAuth("Authorization")
  @UserAuth()
  @ApiConsumes(FormType.UrlEncoded, FormType.Json)
  createForBlog(@Body() createCommentBlogDto: CreateCommentBlogDto) {
    return this.commentService.createForBlog(createCommentBlogDto);
  }

  @Delete(':id')
  @ApiBearerAuth("Authorization")
  @Roles("admin")
  @UseGuards(RolesGuard)
  @AdminAuth()
  @ApiConsumes(FormType.UrlEncoded, FormType.Json)
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
