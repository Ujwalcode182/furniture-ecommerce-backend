import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Furniture } from './furniture.entity';

@Injectable()
export class FurnitureService {
  constructor(
    @InjectRepository(Furniture)
    private furnitureRepository: Repository<Furniture>,
  ) {}

  async findAll(): Promise<Furniture[]> {
    return this.furnitureRepository.find({
      relations: ['reviews'],
    });
  }

  async findOne(id: string): Promise<Furniture> {
    return this.furnitureRepository.findOne({
      where: { id },
      relations: ['reviews', 'reviews.user'],
    });
  }

  async create(furniture: Partial<Furniture>): Promise<Furniture> {
    const newFurniture = this.furnitureRepository.create(furniture);
    return this.furnitureRepository.save(newFurniture);
  }

  async update(id: string, furniture: Partial<Furniture>): Promise<Furniture> {
    await this.furnitureRepository.update(id, furniture);
    return this.findOne(id);
  }

  async getRecommended(userId: string): Promise<Furniture[]> {
    // Get categories of furniture the user has purchased
    const userPurchasesQuery = `
      SELECT DISTINCT f.category
      FROM furniture f
      INNER JOIN order_items oi ON f.id = oi."furnitureId"
      INNER JOIN orders o ON oi."orderId" = o.id
      WHERE o."userId" = $1
      AND o.status = 'completed'
    `;
    
    const userCategories = await this.furnitureRepository.query(userPurchasesQuery, [userId]);
    
    if (userCategories.length === 0) {
      // If no purchases, return popular items
      return this.furnitureRepository.find({
        take: 5,
        order: { createdAt: 'DESC' },
      });
    }
    
    const categories = userCategories.map((c: any) => c.category);
    
    // Find furniture in same categories that user hasn't purchased
    const query = `
      SELECT DISTINCT f.*
      FROM furniture f
      WHERE f.category = ANY($1)
      AND f.id NOT IN (
        SELECT oi."furnitureId"
        FROM order_items oi
        INNER JOIN orders o ON oi."orderId" = o.id
        WHERE o."userId" = $2
        AND o.status = 'completed'
      )
      ORDER BY f."createdAt" DESC
      LIMIT 5
    `;
    
    const recommended = await this.furnitureRepository.query(query, [categories, userId]);
    
    // If not enough recommendations, fill with other popular items
    if (recommended.length < 5) {
      const additionalQuery = `
        SELECT DISTINCT f.*
        FROM furniture f
        WHERE f.id NOT IN (
          SELECT oi."furnitureId"
          FROM order_items oi
          INNER JOIN orders o ON oi."orderId" = o.id
          WHERE o."userId" = $1
          AND o.status = 'completed'
        )
        AND f.category != ALL($2)
        ORDER BY f."createdAt" DESC
        LIMIT $3
      `;
      
      const additional = await this.furnitureRepository.query(
        additionalQuery,
        [userId, categories, 5 - recommended.length]
      );
      
      return [...recommended, ...additional];
    }
    
    return recommended;
  }
}

