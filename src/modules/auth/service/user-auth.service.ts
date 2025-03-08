import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserCheckOtpDto, UserSendOtpDto } from "../dto/Authenticate.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Repository } from "typeorm";
import { randomInt } from "crypto";
import { OtpEntity } from "src/modules/user/entities/otp.entity";
import { UserPayload } from "../types/payload.type";
import { JwtService } from "@nestjs/jwt";
import { RoleEnum } from "../rbac/enum/rbac.enum";
import { RoleEntity } from "../rbac/entity/role.entity";

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    private jwtService: JwtService,
    @InjectRepository(RoleEntity) private roleRepository: Repository<RoleEntity>
  ) {}

  async checkExistUserByPhone(phone: string) {
    let user = await this.userRepository.findOneBy({ phone });
    const roleName = RoleEnum.User;

    if (!user) {
      const role = await this.roleRepository.findOne({
        where: { name: roleName },
      });

      if (!role) {
        throw new BadRequestException(`Role ${roleName} does not exist`);
      }

      user = this.userRepository.create({
        phone,
        role,
      });

      user = await this.userRepository.save(user);
    }

    return user;
  }

  async createOtpForUser(user: UserEntity) {
    const expires_in = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();
    let otp = await this.otpRepository.findOneBy({ userId: user.id });
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException("otp code is not expired");
      }
      otp.code = code;
      otp.expires_in = expires_in;
    } else {
      otp = await this.otpRepository.create({
        code,
        expires_in: expires_in,
        userId: user.id,
      });
    }
    await this.otpRepository.save(otp);
    user.otpId = otp.id;
    await this.userRepository.save(user);
    return {
      message: "Otp Code Sent Successfully",
      code: code,
    };
  }

  private generateTokensForUser(payload: UserPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: "30d",
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: "1y",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async sendOtp(userSendOtpDto: UserSendOtpDto) {
    const { phone } = userSendOtpDto;
    const user = await this.checkExistUserByPhone(phone);
    return this.createOtpForUser(user);
  }

  async checkOtp(userCheckOtpDto: UserCheckOtpDto) {
    const { code, phone } = userCheckOtpDto;
    const now = new Date();
    const user = await this.userRepository.findOne({
      where: { phone },
      relations: {
        otp: true,
      },
    });
    if (!user || !user?.otp) {
      throw new UnauthorizedException("Not Found Account");
    }
    const otp = user?.otp;
    if (otp?.code !== code) {
      throw new UnauthorizedException("otp code is incorrect");
    }
    if (otp?.expires_in < now) {
      throw new UnauthorizedException("otp code is expired");
    }
    if (!user?.verified) {
      await this.userRepository.update({ id: user.id }, { verified: true });
    }
    const { accessToken, refreshToken } = this.generateTokensForUser({
      id: user?.id,
      type: "user"
    });
    return {
      accessToken,
      refreshToken,
      message: "you logged in successfully",
    };
  }

  async getUserRolesFromToken(token: string): Promise<string[]> {
    const decoded = this.jwtService.verify(token, {
      secret: process.env.ACCESS_TOKEN_SECRET,
    });
  
    if (decoded.type !== "user") {
      throw new UnauthorizedException("Invalid token type");
    }
  
    const userId = decoded.id;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["role"],
    });
  
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
  
    return [user.role.name];
  }

  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<UserPayload>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      if (typeof payload === "object" && payload?.id) {
        const user = await this.userRepository.findOneBy({ id: payload.id });
        if (!user) {
          throw new UnauthorizedException("login on your account ");
        }
        return user;
      }
      throw new UnauthorizedException("login on your account ");
    } catch (error) {
      throw new UnauthorizedException("login on your account ");
    }
  }
}
