import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleEntity } from "../entity/role.entity";
import { Repository } from "typeorm";

@Injectable()
export class seedService implements OnModuleInit {
    constructor(
        @InjectRepository(RoleEntity) private roleRepository : Repository<RoleEntity>,
    ) {}

    async onModuleInit() {
        await this.seedRoles()
    }
    private async seedRoles() {
        const roles = [
            {name: "admin", description: "this is admin"},
            {name: "user", description: "this is user"},
            {name: "accountant", description: "this is accountant"},
        ]

       for(const roleData of roles) {
        const existRole = await this.roleRepository.findOne({
            where: {name: roleData.name}
        });
        if(!existRole) {
            const role = await this.roleRepository.create(roleData)
            await this.roleRepository.save(role)
        }
       }

    }
    
}