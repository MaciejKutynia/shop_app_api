import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesModel } from '../entities/categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesModel)
    private readonly categoriesRepo: Repository<CategoriesModel>,
  ) {}

  public async getCategoryByUrlKey(url_key: string) {
    return this.categoriesRepo.findOne({ where: { url_key } });
  }
}
