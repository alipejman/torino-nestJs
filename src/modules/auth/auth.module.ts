
import { Module } from '@nestjs/common';
import { AdminAuthController } from './controller/admin-auth.controller';
import { UserAuthController } from './controller/user-auth.controller';
import { AdminAuthService } from './service/admin-auth.service';
import { UserAuthService } from './service/user-auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { OtpEntity } from '../user/entities/otp.entity';
import { JwtService } from '@nestjs/jwt';
import { seedService } from './rbac/services/seed.service';
import { RoleEntity } from './rbac/entity/role.entity';
import { AdminEntity } from '../admin/entity/admin.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, OtpEntity, RoleEntity, AdminEntity]),
  ],
  controllers: [UserAuthController, AdminAuthController],
  providers: [UserAuthService, AdminAuthService, JwtService, seedService],
  exports: [TypeOrmModule,UserAuthService, AdminAuthService, JwtService, seedService ]
})
export class AuthModule {}
