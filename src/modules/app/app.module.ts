import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "src/config/typeOrm.config";
import { config } from "dotenv";
import { JwtService } from "@nestjs/jwt";
import { TourModule } from "../tour/tour.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "../auth/auth.module";
import { CommentModule } from "../comment/comment.module";
import { BlogModule } from "../blog/blog.module";
import { UserModule } from "../user/user.module";
import { BannerModule } from "../banner/banner.module";
import { ReserveModule } from "../reserve/reserve.module";
import { SearchModule } from "../search/search.module";
config();

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    AuthModule,
    UserModule,
    SearchModule,
    TourModule,
    ReserveModule,
    BlogModule,
    CommentModule,
    BannerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
