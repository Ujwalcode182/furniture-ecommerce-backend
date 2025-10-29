import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Furniture } from './furniture.entity';
import { FurnitureService } from './furniture.service';
import { FurnitureController } from './furniture.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Furniture])],
  controllers: [FurnitureController],
  providers: [FurnitureService],
  exports: [FurnitureService],
})
export class FurnitureModule {}

