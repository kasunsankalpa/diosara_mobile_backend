import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Invoice } from '../invoice/invoice.entity';
import { Item } from '../item/item.entity';

@Entity()
export class InvoiceDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Invoice)
  invoice: Invoice;

  

  @ManyToOne(() => Item)
  item: Item;

  @Column()
  qty:number;

  @Column('decimal', { precision: 10, scale: 2 })
  itemPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  discount: number;

   @Column('decimal', { precision: 10, scale: 2 })
  discountedPrice: number;

   @Column('decimal', { precision: 10, scale: 2 })
  discountedPercentage: number;
  

  @Column({ type: 'enum', enum: [1 , 3], default: 1 })
  status: number;
}