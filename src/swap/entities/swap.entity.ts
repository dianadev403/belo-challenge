import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Swap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pair: string;

  @Column('decimal')
  volume: number;

  @Column()
  price: string;

  @Column()
  orderId: number; 
}