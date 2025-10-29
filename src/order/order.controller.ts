import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.entity';

@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() orderData: any): Promise<Order> {
    return this.orderService.create(orderData);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string): Promise<Order[]> {
    return this.orderService.findByUser(userId);
  }
}

