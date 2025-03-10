import { Module } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { BlogController } from "./blog.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { S3Service } from "../S3/s3.service";
import { TourService } from "../tour/tour.service";
import { TourModule } from "../tour/tour.module";

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity]), AuthModule, TourModule],
  controllers: [BlogController],
  providers: [BlogService, JwtService, S3Service, TourService],
  exports: [TypeOrmModule, BlogService]
})
export class BlogModule {}
