import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Swap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pair: string;

  @Column()
  volume: number;

  @Column()
  price: string;

  //transactionId binance?
  //fecha y hora
}