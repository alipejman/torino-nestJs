import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TourEntity } from '../tour/entities/tour.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TourEntity])
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
