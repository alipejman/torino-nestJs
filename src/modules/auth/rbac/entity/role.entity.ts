import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, OneToMany, OneToOne } from "typeorm";
import { AdminEntity } from "src/modules/admin/entity/admin.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";

@Entity("roles")
export class RoleEntity extends BaseEntity {
    @Column({unique: true, nullable: true})
    name: string;
    @Column({nullable:true})
    description: string;
    @OneToMany(() => AdminEntity, (admins) => admins.role)
    admins: AdminEntity[];
    @OneToMany(() => UserEntity, (users) => users.role)
    users: UserEntity[];
}