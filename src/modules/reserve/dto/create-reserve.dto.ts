import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateReserveDto {
    @ApiProperty()
    tourId: number;
}



export class ConfirmPassengerDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nationalCode: string;

   @ApiProperty()
    @IsNotEmpty()
    @IsString()
    firstname: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastname: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    birth: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    gender: string;
}