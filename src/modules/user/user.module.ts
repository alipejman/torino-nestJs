import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfileEntity } from "./entities/profile.entity";
import { UserEntity } from "./entities/user.entity";
import { AuthModule } from "../auth/auth.module";
import { ReserveEntity } from "../reserve/entities/reserve.entity";
import { TourEntity } from "../tour/entities/tour.entity";
import { TransactionEntity } from "../transaction/entities/transaction.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity, UserEntity, ReserveEntity, TourEntity, TransactionEntity]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
