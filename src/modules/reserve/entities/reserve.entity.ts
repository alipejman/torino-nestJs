import { BaseEntity } from "src/common/entity/base.entity";
import { ReserveStatus } from "src/common/enums/tour-status.enum";
import { TourEntity } from "src/modules/tour/entities/tour.entity";
import { TransactionEntity } from "src/modules/transaction/entities/transaction.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

@Entity("reserve")
export class ReserveEntity extends BaseEntity {
  @Column({
    type: "enum",
    enum: ReserveStatus,
    default: ReserveStatus.Pending,
    nullable: true,
  })
  reserveStatus: ReserveStatus;

  @Column({ nullable: true })
  reservationDate: Date;

  @Column({ nullable: true })
  expirationDate: Date;

  @Column({ nullable: true })
  passengerId: number;

  @Column({ nullable: true })
  userId: number;
  @ManyToOne(() => UserEntity, (user) => user.reservation)
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @Column({ nullable: true })
  tourId: number;
  @ManyToOne(() => TourEntity, (tour) => tour.reservation)
  @JoinColumn({ name: "tourId" })
  tour: TourEntity;

  @Column({ nullable: true })
  transactionId: number;
  @OneToOne(() => TransactionEntity, (transaction) => transaction.reservation)
  @JoinColumn({ name: "transactionId" })
  transaction: TransactionEntity;
}
