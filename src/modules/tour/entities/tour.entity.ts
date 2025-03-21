import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity, JoinColumn, OneToMany } from "typeorm";
import { TourStatusEnum, TransportEnum } from "../enum/tour.enum";
import { CommentEntity } from "src/modules/comment/entities/comment.entity";
import { ReserveEntity } from "src/modules/reserve/entities/reserve.entity";

@Entity("tour")
export class TourEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  images: string; 

  @Column({ nullable: true })
  imageKeys: string;

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

  @Column({nullable: true, default: 0})
  reserved: number;

  @Column({ default: true })
  insurance: boolean;

  @Column()
  leader: string;

  @Column("decimal", { precision: 10 , nullable: true})
  price: number;


  @Column({
    type: "enum",
    enum: TourStatusEnum,
    default: TourStatusEnum.InProgress,
  })
  status: TourStatusEnum;

  @OneToMany(() => CommentEntity, (comment) => comment.tour)
  comments: CommentEntity[]


  @OneToMany(() => ReserveEntity, (reserve) => reserve.tour)
  reservation: ReserveEntity[];
  
}