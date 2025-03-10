import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentEntity } from "./entities/comment.entity";
import { UserEntity } from "../user/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { AuthModule } from "../auth/auth.module";
import { TourService } from "../tour/tour.service";
import { TourModule } from "../tour/tour.module";
import { BlogService } from "../blog/blog.service";
import { BlogModule } from "../blog/blog.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    AuthModule,
    TourModule,
    BlogModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
