import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProfileEntity } from "./entities/profile.entity";
import { Repository } from "typeorm";
import { CreatePersonalInfoDto } from "./dto/profile.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { UserEntity } from "./entities/user.entity";
import { validate } from "class-validator";

@Injectable({scope: Scope.REQUEST})
export class UserService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity) private userRepository:Repository<UserEntity>,
  ) {}

  async addPersonalInfo(createPersonalINfoDto: CreatePersonalInfoDto) {
    try {
        const { firstname, lastname, nationalCode, birth } = createPersonalINfoDto;

        const errors = await validate(createPersonalINfoDto);
        if (errors.length > 0) {
            console.error(errors);
            throw new BadRequestException("مقادیر ورودی نامعتبر");
        }

        const { id } = this.request.user;
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException("User not found");
        }

        let personalInfo = await this.profileRepository.findOne({
            where: { user: { id: user.id } },
        });

        if (personalInfo) {
            personalInfo.firstname = firstname;
            personalInfo.lastname = lastname;
            personalInfo.nationalCode = nationalCode;
            personalInfo.birth = birth;

            await this.profileRepository.save(personalInfo);
        } else {
            personalInfo = this.profileRepository.create({
                firstname,
                lastname,
                nationalCode,
                birth,
                user
            });
            await this.profileRepository.save(personalInfo);
        }

        user.profile = personalInfo;
        await this.userRepository.save(user);
        return {
            message: "Personal Info successfully was registered/updated✅"
        };
    } catch (error) {
        throw new BadRequestException(error?.message);
    }
}


}
