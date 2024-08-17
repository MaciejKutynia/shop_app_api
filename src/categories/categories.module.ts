import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModel } from './entities/categories.entity';
import { CategoriesService } from './services/categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriesModel])],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
