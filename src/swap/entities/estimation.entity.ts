import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Estimation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pair: string;

  @Column('decimal')
  volume: number;

  @Column()
  operation: string;

  @Column('decimal')
  estimatedPrice: number;

  @Column({ type: 'timestamp' })
  validUntil: Date;
}