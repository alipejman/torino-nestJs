import { BaseEntity } from "src/common/entity/base.entity";
import { CommentEntity } from "src/modules/comment/entities/comment.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity("blog")
export class BlogEntity extends BaseEntity {
  @Column()
  title: string;
  @Column({ unique: true })
  slug: string;
  @Column({ nullable: true })
  images: string;
  @Column({ nullable: true })
  imageKeys: string;
  @Column()
  description: string;
  @Column()
  text: string;
  @OneToMany(() => CommentEntity, (comment) => comment.blog)
  comments: CommentEntity[];
}
