import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProfileEntity } from "./entities/profile.entity";
import { Repository } from "typeorm";
import { CreatePersonalInfoDto, SetMailDto } from "./dto/profile.dto";
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


  async getUserProfile() {
    try {
        const { id } = this.request.user;
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ["profile"],
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user.profile;
    } catch (error) {
        throw new BadRequestException(error?.message);
        
    }
  }

  async addPersonalInfo(createPersonalINfoDto: CreatePersonalInfoDto) {
    try {
        const { firstname, lastname, nationalCode, birth, gender } = createPersonalINfoDto;

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
            personalInfo.gender = gender

            await this.profileRepository.save(personalInfo);
        } else {
            personalInfo = this.profileRepository.create({
                firstname,
                lastname,
                nationalCode,
                birth,
                user,
                gender
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

    async setEmail(setEmailDto: SetMailDto) {
        try {
            const { email } = setEmailDto;
            const errors = await validate(setEmailDto);
            if (errors.length > 0) {
                console.error(errors);
                throw new BadRequestException("مقادیر ورودی نامعتبر");
            }

            const { id } = this.request.user;
            const user = await this.userRepository.findOne({
                where: { id },
                relations: ["profile"],
            })
            if (!user) {
                throw new NotFoundException("User not found");
            }

            user.profile.email = email;
            await this.profileRepository.save(user.profile);
            return {
                message: "Email successfully was registered/updated✅"
            };
        } catch (error) {
            throw new BadRequestException(error?.message);
        }
    }
}
