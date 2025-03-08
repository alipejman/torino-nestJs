import { ApiProperty } from "@nestjs/swagger";
import { TourStatusEnum, TransportEnum } from "../enum/tour.enum";
import {
  IsString,
  IsDateString,
  IsEnum,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTourDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty({ format: "binary" })
  image: string;

  @ApiProperty()
  @IsString()
  origin: string;

  @ApiProperty()
  @IsString()
  destination: string;

  @ApiProperty()
  @IsDateString()
  @Transform(({ value }) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format for start_date');
    }
    return date.toISOString();
  })
  start_date: Date;

  @ApiProperty()
  @IsDateString()
  @Transform(({ value }) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format for end_date');
    }
    return date.toISOString();
  })
  end_date: Date;

  @ApiProperty({
    format: "enum",
    enum: TransportEnum,
    default: TransportEnum.Buss,
  })
  @IsEnum(TransportEnum)
  transport_type: TransportEnum;

  @ApiProperty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  capacity: number;

  @ApiProperty({ default: true })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  insurance: boolean;

  @ApiProperty()
  @IsString()
  leader: string;

  @ApiProperty({
    format: "enum",
    enum: TourStatusEnum,
    default: TourStatusEnum.InProgress,
  })
  @IsEnum(TourStatusEnum)
  status: TourStatusEnum;
}