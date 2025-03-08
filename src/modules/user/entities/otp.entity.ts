import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("otp")
export class OtpEntity extends BaseEntity {
    @Column()
    code: string;

    @Column()
    userId: number;

    @Column()
    expires_in: Date;

    @OneToOne(() => UserEntity, (user) => user.otp)
    @JoinColumn({ name: 'userId' }) // مشخص کردن مالک رابطه
    user: UserEntity;
}