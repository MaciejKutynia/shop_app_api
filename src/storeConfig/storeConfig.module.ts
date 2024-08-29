import { Module } from '@nestjs/common';
import { StoreConfigService } from './services/storeConfig.service';
import { StoreConfigResolver } from './resolvers/storeConfig.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreConfigModel } from './entities/storeConfig.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreConfigModel])],
  providers: [StoreConfigService, StoreConfigResolver],
})
export class StoreConfigModule {}
