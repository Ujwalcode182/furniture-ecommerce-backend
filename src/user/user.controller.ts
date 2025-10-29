import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() user: Partial<User>): Promise<User> {
    return this.userService.create(user);
  }
}

