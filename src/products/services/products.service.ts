import { Injectable } from '@nestjs/common';
import { CreateProductInput, GetProductsInput } from '../models/products.model';
import { checkSKU, createSKU, createUrlKey } from '../../utils/products';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsModel } from '../entities/products.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from '../../categories/services/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsModel)
    private readonly productsRepo: Repository<ProductsModel>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async getAllProducts(params: GetProductsInput) {
    const { page, limit, filters, sort, category_url_key } = params;
    const skip = (page - 1) * limit;
    const { id: category_id } =
      await this.categoriesService.getCategoryByUrlKey(category_url_key);

    const query = this.productsRepo.createQueryBuilder();
    query.where('category_id = :category_id', { category_id });
    const [products, count] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      products,
      count,
    };
  }

  async createProduct(product: CreateProductInput): Promise<ProductsModel> {
    const skus = await this.getSkus();
    const { name, price, description, category_id, variants, image } = product;
    const url_key = createUrlKey(name);
    const sku = checkSKU(createSKU(6), skus);

    return this.productsRepo.save({
      name,
      price,
      description,
      category_id,
      variants: JSON.stringify(variants),
      image,
      url_key,
      sku,
    });
  }

  private async getSkus() {
    const products = await this.productsRepo.find();
    return products.map((product) => product.sku);
  }
}
