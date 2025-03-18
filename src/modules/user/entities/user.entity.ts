import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, ManyToOne, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { ProfileEntity } from "./profile.entity";
import { OtpEntity } from "./otp.entity";
import { RoleEntity } from "src/modules/auth/rbac/entity/role.entity";
import { CommentEntity } from "src/modules/comment/entities/comment.entity";
import { ReserveEntity } from "src/modules/reserve/entities/reserve.entity";

@Entity("users")
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  otpId: number;

  @Column({ default: false })
  verified: boolean;

  @Column({nullable: true})
  profileId: number;

  @OneToOne(() => ProfileEntity, (profile) => profile.user, { cascade: true })
  @JoinColumn({name: "profileId"})
  profile: ProfileEntity;

  @OneToOne(() => OtpEntity, (otp) => otp.user)
  @JoinColumn({ name: "otpId" })
  otp: OtpEntity;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn({ name: "roleId" }) 
  role: RoleEntity; 

  @OneToMany(() => CommentEntity, comment => comment.user)
  comments: CommentEntity[];

  @OneToMany(() => ReserveEntity, (reserve) => reserve.user)
  reservation: ReserveEntity[]
}
