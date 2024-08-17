import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigModel } from '../entities/config.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(ConfigModel)
    private readonly configRepo: Repository<ConfigModel>,
  ) {}

  async getConfig() {
    const data = await this.configRepo.find();
    console.log(data);
    return data;
  }
}
