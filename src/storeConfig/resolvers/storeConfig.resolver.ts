import { Query, Resolver } from '@nestjs/graphql';
import { StoreConfigModel } from '../entities/storeConfig.entity';
import { StoreConfigService } from '../services/storeConfig.service';

@Resolver()
export class StoreConfigResolver {
  constructor(private readonly configService: StoreConfigService) {}

  @Query((returns) => [StoreConfigModel])
  async getConfig() {
    return this.configService.getConfig();
  }
}
