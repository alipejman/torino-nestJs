import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDateString, IsEnum, IsNumber, IsBoolean, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TourStatusEnum, TransportEnum } from "../enum/tour.enum";

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

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsOptional()
  images?: Express.Multer.File[];

  @ApiProperty()
  @IsString()
  origin: string;

  @ApiProperty()
  @IsString()
  destination: string;

  @ApiProperty()
  @IsString()
  @Transform(({ value }) => new Date(value).toISOString()) // تبدیل به ISO 8601
  start_date: Date; // یا Date
  
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => new Date(value).toISOString()) // تبدیل به ISO 8601
  end_date: Date; // یا Date

  @ApiProperty({ enum: TransportEnum, default: TransportEnum.Buss })
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

  @ApiProperty({ enum: TourStatusEnum, default: TourStatusEnum.InProgress })
  @IsEnum(TourStatusEnum)
  status: TourStatusEnum;
}