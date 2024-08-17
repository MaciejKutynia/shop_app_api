import { Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { ConfigResolver } from './resolvers/config.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModel } from './entities/config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigModel])],
  providers: [ConfigService, ConfigResolver],
})
export class ConfigModule {}
