import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async create(reviewData: {
    furnitureId: string;
    userId: string;
    rating: number;
    comment: string;
  }): Promise<Review> {
    const review = this.reviewRepository.create({
      furniture: { id: reviewData.furnitureId } as any,
      user: { id: reviewData.userId } as any,
      rating: reviewData.rating,
      comment: reviewData.comment,
    });

    return this.reviewRepository.save(review);
  }

  async findByFurniture(furnitureId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { furniture: { id: furnitureId } as any },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}

