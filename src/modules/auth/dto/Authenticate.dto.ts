import { ApiProperty, PartialType } from "@nestjs/swagger";
import { RoleEnum } from "../rbac/enum/rbac.enum";
import { IsMobilePhone, IsString, Length } from "class-validator";

export class AdminRegisterDto {
    @ApiProperty()
    @IsString()
    @Length(5, 10)
    username: string;
    @ApiProperty()
    @IsString()
    @Length(5, 15, {message: "please enter 5 to 15 character !"})
    password: string;
    @ApiProperty({
        format: "enum",
        enum: RoleEnum
    })
    role: RoleEnum;
}

export class AdminLoginDto {
    @ApiProperty()
    username: string;
    @ApiProperty()
    password: string;
}

export class UserSendOtpDto {
    @ApiProperty()
    @IsMobilePhone("fa-IR", {}, {message: "invalid phone number!"})
    @IsString()
    phone: string;
}

export class UserCheckOtpDto extends PartialType(UserSendOtpDto) {
    @ApiProperty()
    @IsString()
    code: string;
}