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
config();

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    AuthModule,
    TourModule,
    BlogModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
