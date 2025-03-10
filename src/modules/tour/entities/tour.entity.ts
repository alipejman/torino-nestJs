import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { TourStatusEnum, TransportEnum } from "../enum/tour.enum";
import { CommentEntity } from "src/modules/comment/entities/comment.entity";

@Entity("tour")
export class TourEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  images: string; // ذخیره به عنوان رشته‌ی جدا شده با کاما (مثال: "url1,url2,url3")

  @Column({ nullable: true })
  imageKeys: string; // ذخیره به عنوان رشته‌ی جدا شده با کاما (مثال: "key1,key2,key3")

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column({
    type: "enum",
    enum: TransportEnum,
    default: TransportEnum.Buss,
  })
  transport_type: TransportEnum;

  @Column()
  capacity: number;

  @Column({ default: true })
  insurance: boolean;

  @Column()
  leader: string;

  @Column({
    type: "enum",
    enum: TourStatusEnum,
    default: TourStatusEnum.InProgress,
  })
  status: TourStatusEnum;

  @OneToMany(() => CommentEntity, (comment) => comment.tour)
  comments: CommentEntity[]
}