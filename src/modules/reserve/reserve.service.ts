import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import {
  ConfirmPassengerDto,
  CreateReserveDto,
} from "./dto/create-reserve.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { TourEntity } from "../tour/entities/tour.entity";
import { Repository } from "typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { ProfileEntity } from "../user/entities/profile.entity";
import { RoleEntity } from "../auth/rbac/entity/role.entity";
import { ReserveStatus } from "src/common/enums/tour-status.enum";
import { TourStatusEnum } from "../tour/enum/tour.enum";
import { ReserveEntity } from "./entities/reserve.entity";
import { generateExpirationDate } from "src/common/utils/function.util";
import { TransactionEntity } from "../transaction/entities/transaction.entity";
import { randomInt } from "crypto";

@Injectable({ scope: Scope.REQUEST })
export class ReserveService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(TourEntity)
    private tourRepository: Repository<TourEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(ReserveEntity)
    private reserveRepository: Repository<ReserveEntity>,
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>
  ) {}

  private async findOneTour(id: number) {
    try {
      const tour = await this.tourRepository.findOne({
        where: { id },
      });
      if (!tour) {
        throw new NotFoundException("tour not exist !");
      }
      return tour;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message);
    }
  }

  private async findOneReserve(reserveId: number) {
    try {
      const reserve = await this.reserveRepository.findOne({
        where: {
          id: reserveId,
        },
        relations: {
          tour: true,
        },
      });
      if (!reserve) {
        throw new NotFoundException("reserve list not found");
      }
      return reserve;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message);
    }
  }

  private async findPassengerAndCreate(
    confirmPassengerDto: ConfirmPassengerDto
  ) {
    try {
      const { nationalCode, firstname, lastname, phone, gender, birth } =
        confirmPassengerDto;
      const passenger = await this.profileRepository.findOne({
        where: { nationalCode: nationalCode },
        relations: {
          user: true,
        },
      });
      if (!passenger) {
        const role = await this.roleRepository.findOne({
          where: { id: 2 },
        });
        if (!role) {
          throw new NotFoundException("role not exist !");
        }
        const newUser = await this.userRepository.create({
          phone,
          role,
        });
        await this.userRepository.save(newUser);
        const newProfile = await this.profileRepository.create({
          nationalCode: nationalCode,
          firstname: firstname,
          lastname: lastname,
          gender: gender,
          birth: birth,
          userId: newUser.id,
        });
        await this.profileRepository.save(newProfile);
        newUser.profileId = newProfile.id;
        await this.userRepository.save(newUser);
        return {
          newUser: newUser.id,
          newProfile: newProfile.id,
          nationalCode,
          firstname,
          lastname,
          phone,
          gender,
          birth,
        };
      }
      return {
        nationalCode: passenger.nationalCode,
        phone: passenger.user.phone,
        firstname: passenger.firstname,
        lastname: passenger.lastname,
        gender: passenger.gender,
        birth: passenger.birth,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message);
    }
  }

  private async checkReserveForCreate(userId: number, tourId: number) {
    try {
      const existingReserve  = await this.reserveRepository.findOne({
        where: {
          userId: userId,
          tourId: tourId,
          reserveStatus: ReserveStatus.Reserved,
        },
      });
      if (existingReserve) {
        throw new BadRequestException("you already reserved this tour !");
      }
      const pendingReserve  = await this.reserveRepository.findOne({
        where: {
          userId: userId,
          tourId: tourId,
          reserveStatus: ReserveStatus.Pending,
        },
      });
      if (pendingReserve) {
        throw new BadRequestException("you already added to reserve list !");
      }

      if (!existingReserve || !pendingReserve) {
        return;
      }
      return;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message);
    }
  }

  async create(createReserveDto: CreateReserveDto) {
    try {
      const { id: userId } = this.request.user;
      const { tourId } = createReserveDto;
      const tour = await this.findOneTour(tourId);
      if (tour.reserved >= tour.capacity) {
        throw new BadRequestException("tour capacity is fulled !");
      }
      if (tour.status === TourStatusEnum.Finished) {
        throw new BadRequestException("tour is finished !");
      }
      await this.checkReserveForCreate(userId, tourId);

      const newReserve = await this.reserveRepository.create({
        reserveStatus: ReserveStatus.Pending,
        userId: userId,
        reservationDate: new Date(),
        expirationDate: generateExpirationDate(),
        tourId: tourId,
      });
      await this.reserveRepository.save(newReserve);
      return {
        message:
          "tour added to reserve list you should payment until 5 minuts later",
        newReserve: newReserve.id,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message);
    }
  }

  async cancel(reserveId: number) {
    try {
      const { id: userId } = this.request.user;
      const reserve = await this.findOneReserve(reserveId);
      if (reserve.userId !== userId) {
        throw new BadRequestException("somthing wrong !!");
      }
      reserve.reserveStatus = ReserveStatus.Cancelled;
      await this.reserveRepository.save(reserve);
      return {
        message: "reserve cancelled !",
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message);
    }
  }

  async confirm(reserveId: number, confirmPassengerDto: ConfirmPassengerDto) {
    try {
      const reserve = await this.findOneReserve(reserveId);
      const passengerDto =
        await this.findPassengerAndCreate(confirmPassengerDto);
      const {
        birth,
        firstname,
        gender,
        lastname,
        nationalCode,
        phone,
        newProfile,
        newUser,
      } = passengerDto;
      console.log(reserve);

      if (
        reserve.reserveStatus === ReserveStatus.Cancelled ||
        reserve.reserveStatus === ReserveStatus.Failed
      ) {
        throw new BadRequestException("reserved is failed or cancelled !");
      }

      const newTransaction = await this.transactionRepository.create({
        amount: reserve.tour.price,
        orderNumber: randomInt(10000, 99999).toString(),
        transactionType: "رزرو تور گردشگری",
        reservationId: reserve.id,
      });
      await this.transactionRepository.save(newTransaction);

      reserve.tour.reserved += 1;
      reserve.passengerId = newUser;
      reserve.reserveStatus = ReserveStatus.Reserved;
      reserve.transactionId = newTransaction.id;
      reserve.tour.reservationId = reserve.id;
      await this.tourRepository.save;
      await this.reserveRepository.save(reserve);
      return {
        message: "tour successfully reserved ✅",
        reserve: {
          reserve,
        },
        transaction: {
          newTransaction,
        },
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message);
    }
  }
}
