import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity } from "typeorm";

@Entity("banner")
export class BannerEntity extends BaseEntity {
    @Column({nullable: true})
    title: string;
    @Column({nullable: true})
    description: string;
    @Column({nullable:true})
    image: string;
    @Column({nullable:true})
    image_key: string;
    @Column({nullable:true})
    phone: string;
    @Column({nullable:true})
    button_link: string;
    @Column({
        nullable:true,
        type: "enum",
        enum: ["white", "red", "blue", "black", "orange", "yellow", "pink", "brown", "green", "purple"],
    })
    button_color: string;
    @Column({
        nullable: true,
        type: "enum",
        enum: ["true", "false"],
    })
    isActivate: string
}
