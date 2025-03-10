import { Module } from '@nestjs/common';
import { TourService } from './tour.service';
import { TourController } from './tour.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourEntity } from './entities/tour.entity';
import { S3Service } from '../S3/s3.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TourEntity]), AuthModule],
  controllers: [TourController],
  providers: [TourService, S3Service],
  exports: [TypeOrmModule, S3Service, TourService]
})
export class TourModule {}
