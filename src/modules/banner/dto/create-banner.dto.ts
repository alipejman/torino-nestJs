import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, Length } from "class-validator";

export class CreateBannerDto {
  @ApiProperty({ nullable: true, example: "Summer Sale" })
  @IsString()
  @Length(3, 50)
  @IsOptional()
  title: string;

  @ApiProperty({ nullable: true, example: "Get up to 50% off on selected items!" })
  @IsString()
  @Length(10, 255)
  @IsOptional()
  description: string;

  @ApiProperty({ nullable: true, format: "binary" })
  @IsOptional()
  image: string;

  @ApiProperty({ nullable: true, example: "+1234567890" })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({ nullable: true, example: "https://example.com/shop" })
  @IsString()
  @IsOptional()
  button_link: string;

  @ApiProperty({
    nullable: true,
    enum: ["white", "red", "blue", "black", "orange", "yellow", "pink", "brown", "green", "purple"],
    example: "blue",
  })
  @IsEnum(["white", "red", "blue", "black", "orange", "yellow", "pink", "brown", "green", "purple"])
  @IsOptional()
  button_color: string;

  @ApiProperty({ nullable: true, enum: ["true", "false"], example: "true" })
  @IsEnum(["true", "false"])
  @IsOptional()
  isActivate: string;
}