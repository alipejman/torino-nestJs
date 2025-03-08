import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("user-profile")
export class ProfileEntity extends BaseEntity {
    @Column({ nullable: true })
    nationalCode: string;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    birth: Date;

    @Column({ nullable: true })
    email: string;

    @OneToOne(() => UserEntity, (user) => user.profile)
    @JoinColumn({ name: 'user_id' }) // مشخص کردن مالک رابطه
    user: UserEntity;
}