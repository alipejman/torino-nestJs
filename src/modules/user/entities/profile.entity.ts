import { BaseEntity } from "src/common/entity/base.entity";
import { EntityName } from "src/common/enums/entityName.enum";
import { Column, Entity, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity(EntityName.UserProfile)
export class ProfileEntity extends BaseEntity {
    @Column({nullable: true})
    nationalCode: string;
    @Column({nullable: true})
    gender: string;
    @Column({nullable: true})
    birth: Date;
    @Column({nullable: true})
    email: string;
    @OneToOne(() => UserEntity, (user) => user.profile)
    user: UserEntity 
}