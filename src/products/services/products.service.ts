import { Injectable } from '@nestjs/common';
import { CreateProductInput, GetProductsInput } from '../models/products.model';
import { checkSKU, createSKU, createUrlKey } from '../../utils/products';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsModel } from '../entities/products.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from '../../categories/services/categories.service';
import { ProductsResponseInterface } from '../interfaces/products.interface';
import { CartProductInterface } from '../../cart/interfaces/cart.interface';
import { StripeProductItemInterface } from '../../stripe/interfaces/stripe.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsModel)
    private readonly productsRepo: Repository<ProductsModel>,
    private readonly categoriesService: CategoriesService,
  ) {}

  /**
   * Retrieves all products based on the provided parameters.
   * @param {GetProductsInput} params - The parameters for retrieving products.
   * @returns {Promise<ProductsResponseInterface>} - The products and the total count.
   */
  public async getAllProducts(
    params: GetProductsInput,
  ): Promise<ProductsResponseInterface> {
    const { page, limit, filters, sort, category_url_key } = params;
    const { order_by, direction } = sort || {};
    const { price, variant } = filters || {};
    const skip = (page - 1) * limit;
    const { id: category_id } =
      await this.categoriesService.getCategoryByUrlKey(category_url_key);

    const query = this.productsRepo.createQueryBuilder('products');
    query.where('category_id = :category_id', { category_id });

    if (price) {
      query.andWhere('price BETWEEN :min AND :max', {
        min: price[0],
        max: price[1],
      });
    }

    if (variant) {
      query.andWhere('JSON_CONTAINS(products.variants, :variant)', {
        variant: JSON.stringify(variant),
      });
    }

    query.skip(skip).take(limit);

    if (order_by) {
      query.orderBy(order_by, direction);
    }

    const [products, count] = await query.getManyAndCount();

    return {
      products,
      count,
    };
  }

  /**
   * Creates a new product.
   * @param {CreateProductInput} product - The product data to create.
   * @returns {Promise<ProductsModel>} - The created product.
   */
  public async createProduct(
    product: CreateProductInput,
  ): Promise<ProductsModel> {
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

  public async getProductBySku(sku: string): Promise<ProductsModel> {
    return this.productsRepo.findOne({ where: { sku } });
  }

  public async prepareProductsForStripe(
    order_products: CartProductInterface[],
  ): Promise<StripeProductItemInterface[]> {
    const stripe_products = [];
    for (const order_product of order_products) {
      const product = await this.productsRepo.findOne({
        where: { sku: order_product.sku },
      });
      stripe_products.push({
        name: product.name,
        price: product.price,
        quantity: order_product.quantity,
      });
    }
    return stripe_products;
  }

  /**
   * Retrieves all SKUs from the products.
   * @returns {Promise<string[]>} - An array of SKUs.
   */
  private async getSkus(): Promise<string[]> {
    const products = await this.productsRepo.find();
    return products.map((product) => product.sku);
  }
}
