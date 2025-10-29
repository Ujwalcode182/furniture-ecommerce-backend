import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Review } from '../review/review.entity';
import { Order } from '../order/order.entity';

@Entity('furniture')
export class Furniture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('simple-array')
  images: string[];

  @Column('decimal', { precision: 10, scale: 2 })
  width: number;

  @Column('decimal', { precision: 10, scale: 2 })
  height: number;

  @Column('decimal', { precision: 10, scale: 2 })
  depth: number;

  @Column()
  category: string;

  @Column({ default: true })
  inStock: boolean;

  @Column({ default: 0 })
  stockQuantity: number;

  @OneToMany(() => Review, review => review.furniture)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

