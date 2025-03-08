import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { ProfileEntity } from "./profile.entity";
import { OtpEntity } from "./otp.entity";
import { RoleEntity } from "src/modules/auth/rbac/entity/role.entity";

@Entity("users")
export class UserEntity extends BaseEntity {
  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  otpId: number;

  @Column({ default: false })
  verified: boolean;

  @OneToOne(() => ProfileEntity, (profile) => profile.user, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "profileId" })
  profile: ProfileEntity;

  @OneToOne(() => OtpEntity, (otp) => otp.user)
  @JoinColumn({ name: "otpId" })
  otp: OtpEntity;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn({ name: "roleId" }) 
  role: RoleEntity; 
}
