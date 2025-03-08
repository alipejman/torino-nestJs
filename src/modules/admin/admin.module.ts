// src/modules/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminEntity } from './entity/admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
    imports: [TypeOrmModule.forFeature([AdminEntity])],
    providers: [AdminService],
    controllers: [AdminController],
})
export class AdminModule {}