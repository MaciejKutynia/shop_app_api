import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TokenBlackListService } from '../../tokenBlackList/services/tokenBlackList.service';
import { CartService } from '../../cart/services/cart.service';

const cronIntervals = {
  oneAtADay: '0 0 0 * * *',
  testInterval: '*/10 * * * * *',
};

@Injectable()
export class SchedulerService {
  constructor(
    private readonly tokenBlackListService: TokenBlackListService,
    private readonly cartService: CartService,
  ) {}

  @Cron(cronIntervals.oneAtADay)
  async checkBlackListTokens() {
    await this.tokenBlackListService.checkTokens();
  }
}
