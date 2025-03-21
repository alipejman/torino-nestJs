import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProfileEntity } from "./entities/profile.entity";
import { EntityManager, Repository } from "typeorm";
import { CreatePersonalInfoDto, SetMailDto } from "./dto/profile.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { UserEntity } from "./entities/user.entity";
import { validate } from "class-validator";
import { ReserveEntity } from "../reserve/entities/reserve.entity";
import { TourEntity } from "../tour/entities/tour.entity";
import { ReserveStatus } from "src/common/enums/tour-status.enum";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ReserveEntity)
    private reserveRepository: Repository<ReserveEntity>,
    @InjectRepository(TourEntity) private tourRepository: TourEntity,
    private entityManager: EntityManager
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
      const { firstname, lastname, nationalCode, birth, gender } =
        createPersonalINfoDto;

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
        personalInfo.gender = gender;

        await this.profileRepository.save(personalInfo);
      } else {
        personalInfo = this.profileRepository.create({
          firstname,
          lastname,
          nationalCode,
          birth,
          user,
          gender,
        });
        await this.profileRepository.save(personalInfo);
      }

      user.profile = personalInfo;
      await this.userRepository.save(user);
      return {
        message: "Personal Info successfully was registered/updated✅",
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
      });
      if (!user) {
        throw new NotFoundException("User not found");
      }

      user.profile.email = email;
      await this.profileRepository.save(user.profile);
      return {
        message: "Email successfully was registered/updated✅",
      };
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async getUserTour() {
    const { id: userId } = this.request.user;

    try {
      const query = `
            SELECT tour.id, tour.title, tour.origin, tour.destination, tour.start_date, tour.end_date, tour.transport_type, tour.price, tour.status
            FROM reserve
            LEFT JOIN tour ON reserve."tourId" = tour.id
            WHERE reserve."userId" = $1 AND reserve."reserveStatus" = $2;
        `;
      const userTours = await this.entityManager.query(query, [
        userId,
        ReserveStatus.Reserved,
      ]);

      if (!userTours || userTours.length === 0) {
        return {
          message: "you dont have any tours !",
        };
      }

      return {
        tours: userTours,
      };
    } catch (error) {
      console.error("Error fetching user tours:", error);
      throw new BadRequestException(error?.message);
    }
  }

  async getUserTransactions() {
    const { id: userId } = this.request.user;
    try {
      const query = `SELECT transaction."id", transaction."amount", transaction."transactionType", transaction."orderNumber", transaction."createdAt"
      FROM reserve
      LEFT JOIN transaction ON reserve."transactionId" = transaction.id
      WHERE reserve."userId" = $1 AND reserve."reserveStatus" = $2 `;
      

      const userTransaction = await this.entityManager.query(query, [userId, ReserveStatus.Reserved]);

      if (!userTransaction || userTransaction.length === 0) {
        return {
          message: "you dont have any transaction !",
        };
      }

      return {
        transactions: {
          userTransaction,
        },
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message);
    }
  }
}
