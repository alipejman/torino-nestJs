import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, OneToOne, JoinColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("user-profile")
export class ProfileEntity extends BaseEntity {
    @Column({ nullable: true })
    firstname: string;
  
    @Column({ nullable: true })
    lastname: string;
  
    @Column({nullable: true, unique: true })
    nationalCode: string;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    birth: Date;

    @Column({ nullable: true, unique: true })
    email: string;

    @Column({nullable:true})
    userId: number;

    @OneToOne(() => UserEntity, (user) => user.profile)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;
}