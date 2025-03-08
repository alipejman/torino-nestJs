import { BaseEntity } from "src/common/entity/base.entity";
import { Column, Entity } from "typeorm";
import { TourStatusEnum, TransportEnum } from "../enum/tour.enum";


@Entity("tour")
export class TourEntity extends BaseEntity {
    @Column()
    title: string;
    @Column()
    description: string;
    @Column({unique: true})
    slug: string;
    @Column({ nullable: true})
    image: string;
    @Column({nullable: true})
    imageKey: string;
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
        default: TransportEnum.Buss
    })
    transport_type: TransportEnum
    @Column()
    capacity: number
    @Column({default: true})
    insurance: boolean;
    @Column()
    leader: string;
    @Column({
        type: "enum",
        enum: TourStatusEnum,
        default: TourStatusEnum.InProgress
    })
    status: TourStatusEnum;

}
