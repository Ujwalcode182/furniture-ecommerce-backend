import { Controller, Get, Post, Put, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { FurnitureService } from './furniture.service';
import { Furniture } from './furniture.entity';

@Controller('api/furniture')
export class FurnitureController {
  constructor(private readonly furnitureService: FurnitureService) {}

  @Get()
  async findAll(): Promise<Furniture[]> {
    return this.furnitureService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Furniture> {
    return this.furnitureService.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() furniture: Partial<Furniture>): Promise<Furniture> {
    return this.furnitureService.create(furniture);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: string, @Body() furniture: Partial<Furniture>): Promise<Furniture> {
    return this.furnitureService.update(id, furniture);
  }

  @Get('recommended/:userId')
  async getRecommended(@Param('userId') userId: string): Promise<Furniture[]> {
    return this.furnitureService.getRecommended(userId);
  }
}

