import { Module } from "@nestjs/common";
import { BannerService } from "./banner.service";
import { BannerController } from "./banner.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BannerEntity } from "./entities/banner.entity";
import { S3Service } from "../S3/s3.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([BannerEntity]), AuthModule],
  controllers: [BannerController],
  providers: [BannerService, S3Service],
})
export class BannerModule {}
