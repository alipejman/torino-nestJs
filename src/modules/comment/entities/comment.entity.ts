import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { TourEntity } from "src/modules/tour/entities/tour.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { BlogEntity } from "src/modules/blog/entities/blog.entity";

@Entity("comments") 
export class CommentEntity extends BaseEntity {
    @Column()
    text: string;

    @Column({nullable: true})
    tourId: number

    @Column({nullable: true})
    blogId: number

    @Column()
    userId: number

    @ManyToOne(() => TourEntity, tour => tour.comments, {nullable: true})
    tour: TourEntity;

    @ManyToOne(() => UserEntity, user => user.comments)
    user: UserEntity;
    
    @ManyToOne(() => BlogEntity, (blog) => blog.comments, {nullable: true})
    blog: BlogEntity
}