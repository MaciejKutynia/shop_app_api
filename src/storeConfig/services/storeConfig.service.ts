import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreConfigModel } from '../entities/storeConfig.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoreConfigService {
  constructor(
    @InjectRepository(StoreConfigModel)
    private readonly configRepo: Repository<StoreConfigModel>,
  ) {}

  async getConfig() {
    const data = await this.configRepo.find();
    console.log(data);
    return data;
  }
}
