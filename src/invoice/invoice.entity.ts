import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany, JoinColumn } from 'typeorm';
import { Customer } from '../customer/customer.entity';
import { InvoiceDetail } from 'src/invoice-detail/invoice-detail.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer)
  customer: Customer;
  

  @Column('decimal',{ precision: 10, scale: 2 })
  total: number;

  @Column('decimal' ,{ precision: 10, scale: 2 })
  totalDiscount: number;

  @Column('decimal',{ precision: 10, scale: 2 })
  billAmount: number;


  @Column({ type: 'enum', enum: [1, 2, 3], default: 1 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(()=>User)
  user: User;

  @OneToMany(() => InvoiceDetail, detail => detail.invoice)
  invoiceDetails: InvoiceDetail[];
}
