import { Query, Resolver } from '@nestjs/graphql';
import { ConfigModel } from '../entities/config.entity';
import { ConfigService } from '../services/config.service';

@Resolver()
export class ConfigResolver {
  constructor(private readonly configService: ConfigService) {}

  @Query((returns) => [ConfigModel])
  async getConfig() {
    return this.configService.getConfig();
  }
}
