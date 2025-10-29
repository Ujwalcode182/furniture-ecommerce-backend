import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Furniture } from '../furniture/furniture.entity';
import { User } from '../user/user.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Furniture, furniture => furniture.reviews)
  furniture: Furniture;

  @ManyToOne(() => User)
  user: User;

  @Column()
  rating: number;

  @Column('text')
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

