import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SearchDto } from './dto/create-search.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TourEntity } from '../tour/entities/tour.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(TourEntity) private tourRepository:Repository<TourEntity>
  ) {}

  async create(searchDto: SearchDto) {
    try {
      const {origin, destination, start_date} = searchDto;


    const query = await this.tourRepository.createQueryBuilder("tour");
    if(origin) {
      query.andWhere('tour."origin" = :origin', {origin})
    }

    if(destination) {
      query.andWhere('tour."destination" = :destination', {destination})
    }

    if(start_date) {
      query.andWhere('tour."start_date" = :start_date', {start_date})
    }

    const tours = await query.getMany();

    if(tours.length === 0) {
      throw new NotFoundException("tour is not found!")
    }

    return tours;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message);
      
    }
  }


}
