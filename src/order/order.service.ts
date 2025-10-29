import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(orderData: {
    userId: string;
    items: Array<{ furnitureId: string; quantity: number; price: number }>;
    shippingAddress: string;
  }): Promise<Order> {
    const totalAmount = orderData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = this.orderRepository.create({
      user: { id: orderData.userId } as any,
      totalAmount,
      shippingAddress: orderData.shippingAddress,
      status: OrderStatus.COMPLETED,
    });

    const savedOrder = await this.orderRepository.save(order);

    const orderItems = orderData.items.map((item) =>
      this.orderItemRepository.create({
        order: savedOrder,
        furniture: { id: item.furnitureId } as any,
        quantity: item.quantity,
        price: item.price,
      }),
    );

    await this.orderItemRepository.save(orderItems);

    return this.findOne(savedOrder.id);
  }

  async findOne(id: string): Promise<Order> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.furniture', 'user'],
    });
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } as any },
      relations: ['items', 'items.furniture'],
      order: { createdAt: 'DESC' },
    });
  }
}

