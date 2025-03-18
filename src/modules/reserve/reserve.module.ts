import { Module } from '@nestjs/common';
import { ReserveService } from './reserve.service';
import { ReserveController } from './reserve.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourEntity } from '../tour/entities/tour.entity';
import { ReserveEntity } from './entities/reserve.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ProfileEntity } from '../user/entities/profile.entity';
import { AuthModule } from '../auth/auth.module';
import { TransactionEntity } from '../transaction/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TourEntity, ReserveEntity, UserEntity, ProfileEntity, TransactionEntity]),
AuthModule],
  controllers: [ReserveController],
  providers: [ReserveService],
})
export class ReserveModule {}
