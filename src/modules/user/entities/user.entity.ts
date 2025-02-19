import { BaseEntity } from "src/common/entity/base.entity";
import { EntityName } from "src/common/enums/entityName.enum";
import { Column, Entity, OneToOne } from "typeorm";
import { UserStatus } from "../enum/userStatus.enum";
import { ProfileEntity } from "./profile.entity";

@Entity(EntityName.User)
export class UserEntity extends BaseEntity  {
    @Column({nullable:true})
    firstname: string;
    @Column({nullable: true})
    lastname: string;
    @Column({unique: true})
    phone: string;
    @Column({nullable: true})
    otpId: number;
    @Column({default: false})
    verified: boolean;
    @OneToOne(() => ProfileEntity, (profile) => profile.user, {onDelete: "CASCADE"})
    profile: ProfileEntity;
}