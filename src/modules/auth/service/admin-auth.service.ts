import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminEntity } from "src/modules/admin/entity/admin.entity";
import { Repository } from "typeorm";
import { AdminLoginDto, AdminRegisterDto } from "../dto/Authenticate.dto";
import * as bcrypt from "bcrypt";
import { RoleEntity } from "../rbac/entity/role.entity";
import { JwtService } from "@nestjs/jwt";
import { AdminPayload } from "../types/payload.type";

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    private jwtService: JwtService
  ) {}

  async checkUsernameExist(username: string) {
    const admin = await this.adminRepository.findOneBy({ username });
    if (admin) {
      throw new ConflictException("Username Already Used!");
    }
    return username;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error("Error hashing password: " + error.message);
    }
  }

  async register(adminRegisterDto: AdminRegisterDto) {
    try {
      let { username, password, role } = adminRegisterDto;
      const checkUsername = await this.checkUsernameExist(username);
      username = checkUsername;
      password = await this.hashPassword(password);
      const roleEntity = await this.roleRepository.findOne({
        where: { name: role },
      });

      if (!roleEntity) {
        throw new BadRequestException(`Role ${role} does not exist`);
      }
      const admin = this.adminRepository.create({
        username,
        password,
        role: roleEntity,
      });

      await this.adminRepository.save(admin);
      return {
        message: "Admin Create Successfully ✅",
        admin: {
          username,
          role,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(adminLoginDto: AdminLoginDto) {
    const { username, password } = adminLoginDto;
    try {
      const admin = await this.adminRepository.findOne({
        where: { username },
      });
      if (!admin) {
        throw new BadRequestException("invalid username or password!");
      }
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        throw new BadRequestException("invalid username or password!");
      }
      const token = this.generateToken(admin);
      return {
        message: "login successfult ✅",
        admin: {
          username: admin.username,
        },
        tokens: token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private generateToken(admin: AdminEntity) {
    const accessToken = this.jwtService.sign(
      { id: admin.id, username: admin.username, type: "admin" },
      { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: "1h" }
    );
    const refreshToken = this.jwtService.sign(
      { id: admin.id, username: admin.username, type: "admin" },
      { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: "1y" }
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async getAdminRolesFromToken(token: string): Promise<string[]> {
    const decoded = this.jwtService.verify(token, {
      secret: process.env.ACCESS_TOKEN_SECRET,
    });
  
    if (decoded.type !== "admin") {
      throw new UnauthorizedException("Invalid token type");
    }
  
    const adminId = decoded.id;
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
      relations: ["role"],
    });
  
    if (!admin) {
      throw new UnauthorizedException("Admin not found");
    }
  
    return [admin.role.name];
  }

  async validateAccessToken(token: string) {
    try {
      const payload = await this.jwtService.verify<AdminPayload>(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
      if (typeof payload === "object" && payload?.id) {
        const admin = await this.adminRepository.findOneBy({
          id: payload.id,
        });
        
        if (!admin) {
          throw new UnauthorizedException("login on your account ");
        }
        return admin;
      }
      throw new UnauthorizedException("login on your account ");
    } catch (error) {
      throw new UnauthorizedException("login on your account ");
    }
  }
}
