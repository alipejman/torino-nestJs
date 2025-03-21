import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SearchDto } from './dto/create-search.dto';
import { FormType } from 'src/common/enums/form-type.enum';

@Controller('search')
@ApiTags("Search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  @ApiConsumes(FormType.UrlEncoded)
  create(@Body() searchDto: SearchDto) {
    return this.searchService.create(searchDto);
  }

}
