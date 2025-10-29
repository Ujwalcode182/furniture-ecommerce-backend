import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from './review.entity';

@Controller('api/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() reviewData: any): Promise<Review> {
    return this.reviewService.create(reviewData);
  }

  @Get('furniture/:furnitureId')
  async findByFurniture(@Param('furnitureId') furnitureId: string): Promise<Review[]> {
    return this.reviewService.findByFurniture(furnitureId);
  }
}

