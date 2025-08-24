import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  itemCode: string;

  @Column()
  itemName: string;

  @Column()
  startQty: number;

  @Column('decimal', { precision: 10, scale: 2 })
  sellingPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  receivePrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  discount: number;

  @Column({ type: 'enum', enum: ['1', '0'], default: '1' })
  status: number;
}

