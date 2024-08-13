import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AddressModel } from './entities/address.entity';
import { AddressService } from './services/address.service';
import { AddressResolver } from './resolvers/address.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([AddressModel])],
  providers: [AddressService, AddressResolver],
  exports: [AddressService],
})
export class AddressModule {}
