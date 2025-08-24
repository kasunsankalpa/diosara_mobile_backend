import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ length: 15 })
  mobileNum: string;

  @Column({ type: 'enum', enum: [1, 3], default: 1 })
  status: number;

  @Column()
  instituteId: number;

  @CreateDateColumn()
  createdAt: Date;
}
