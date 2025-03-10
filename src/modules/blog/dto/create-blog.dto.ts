import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString, Length, ValidateNested } from "class-validator";

export class CreateBlogDto {
    @ApiProperty()
    @IsString()
    @Length(8, 50)
    title: string
    @ApiProperty()
    @IsString()
    @Length(10,20)
    description: string;
    @ApiProperty()
    slug: string;
    @ApiProperty()
    text: string;
    @ApiProperty({type: "array", items: {type: "string", format: "binary"}})
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Object)
    @IsOptional()
    images?: Express.Multer.File[]

}