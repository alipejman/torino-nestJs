import { IsString, Length } from "class-validator";
import { BaseEntity } from "src/common/entity/base.entity";
import { RoleEntity } from "src/modules/auth/rbac/entity/role.entity";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";

@Entity("admins")
export class AdminEntity extends BaseEntity {
  @Column({ unique: true })
  @IsString()
  @Length(5, 20)
  username: string;

  @Column()
  @IsString()
  @Length(4, 8)
  password: string;

  @Column({ default: 0 })
  failedAttempts: number;

  @Column({ nullable: true })
  bannedUntil: Date;

  @ManyToOne(() => RoleEntity, (role) => role.admins, { onDelete: 'SET NULL' })
  @JoinColumn()
  role: RoleEntity;
}
