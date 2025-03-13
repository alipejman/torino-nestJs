import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length, Matches, Validate } from "class-validator";
import { Transform } from "class-transformer";
import { IsIranianNationalCode } from "src/common/decorators/is-iranian-national-code.decorator";
import { Gender } from "src/common/enums/gender.enum";

export class CreatePersonalInfoDto {
    @ApiProperty()
    firstname: string;

    @ApiProperty()
    lastname: string;

    @ApiProperty({ example: "4860348206" })
    @Length(10, 10, { message: "nationalCode must be exactly 10 characters long" })
    @IsString({ message: "nationalCode must be a string" })
    @Validate(IsIranianNationalCode)
    @Matches(/^\d{10}$/, { message: "nationalCode must be a 10-digit number" })
    @Transform(({ value }) => String(value))
    nationalCode: string;

    @ApiProperty({
        enum: Gender,
        description:"Gender Of the User"
    })
    gender: Gender;

    @ApiProperty()
    birth: Date;
}

export class SetMailDto {
    @ApiProperty()
    @IsEmail({}, { message: "email must be a valid email address" })
    email: string;
}

