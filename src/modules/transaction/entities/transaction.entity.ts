import { BaseEntity } from "src/common/entity/base.entity";
import { ReserveEntity } from "src/modules/reserve/entities/reserve.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity("transaction")
export class TransactionEntity extends BaseEntity {
  @Column("decimal", { precision: 10, nullable: true })
  amount: number;
  @Column({ nullable: true })
  transactionType: string;
  @Column({ nullable: true })
  orderNumber: string;
  @Column({nullable: true})
  reservationId: number;
  @OneToOne(() => ReserveEntity, (reservation) => reservation.transaction)
  @JoinColumn({name: "reservationId"})
  reservation: ReserveEntity;
}
