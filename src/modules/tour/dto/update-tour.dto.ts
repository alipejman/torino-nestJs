import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsDateString, IsEnum, IsNumber, IsBoolean, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TourStatusEnum, TransportEnum } from "../enum/tour.enum";

export class UpdateTourDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsOptional()
  images?: Express.Multer.File[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  origin?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  destination?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @Transform(({ value }) => value ? new Date(value).toISOString() : undefined) // تبدیل به ISO 8601
  @IsOptional()
  start_date?: Date;

  @ApiProperty({ required: false })
  @IsDateString()
  @Transform(({ value }) => value ? new Date(value).toISOString() : undefined) // تبدیل به ISO 8601
  @IsOptional()
  end_date?: Date;

  @ApiProperty({ enum: TransportEnum, required: false })
  @IsEnum(TransportEnum)
  @IsOptional()
  transport_type?: TransportEnum;

  @ApiProperty({ required: false })
  @IsNumber()
  @Transform(({ value }) => value ? Number(value) : undefined)
  @IsOptional()
  capacity?: number;

  @ApiProperty({ required: false })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  insurance?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  leader?: string;

  @ApiProperty({ enum: TourStatusEnum, required: false })
  @IsEnum(TourStatusEnum)
  @IsOptional()
  status?: TourStatusEnum;
}